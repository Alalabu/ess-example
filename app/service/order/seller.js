'use strict';
const _ = require('lodash');
const BaseService = require('../base/base');
const ORDER_STRUTS = require('../../enums/order_struts');
const USE_PATTERN = require('../../enums/use_pattern');
const SJAPP = require('../../util/client-apps');
const { Calendar } = require('calendar2');

/**
 * 商户订单 管理
 */
class SellerService extends BaseService {

  /**
   * 商家放弃订单
   * @param {*} seller_id 
   * @param {*} out_trade_no 
   */
  async giveup({seller_id, out_trade_no, update_at}) {
    const { ctx } = this;
    // 获取操作用户
    // const transaction = await ctx.model.transaction(); // 事务
    try {
      const sequelize = ctx.model;
      const { Order } = sequelize;
      // 1. 查询当前订单状态
      const order = await Order.findOne({
        attributes: ['client_id', 'store_name', 'total_fee', 'use_pattern', 'orderstruts'],
        where: {
          out_trade_no, store_id: seller_id, update_at,
        },
        raw: true,
      });
      if (!order) {
        return ctx.message.storeOrder.orderInvalid({store_id: seller_id, out_trade_no, update_at}, '商家放弃订单, 未查询到条件满足的订单');
      }
      // 2. 更新订单状态
      const result = await Order.update({
        orderstruts: ORDER_STRUTS.SELLER_EXCEP,
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.SELLER_EXCEP}`),
        update_at: ctx.NOW.toDatetime(),
        seller_excep_at: ctx.NOW.toDatetime(),
      } ,{ where: {
        store_id: seller_id, out_trade_no,
        orderstruts: {
          [ctx.Op.in]: [ORDER_STRUTS.PAYED, ORDER_STRUTS.SELLER_TAKE, ORDER_STRUTS.SELLER_DONE]
        }, 
        refund_struts: null, update_at,
      } });
      const affect_rows = result[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        return ctx.message.db.noAffectRows({ seller_id, out_trade_no, update_at }, '商家放弃订单');
      }
      // 2. 查询订单所属用户, 并对其进行退费提醒
      // 2. 消息: 退费提示
      if (order.clint_id) {
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no); // 获取公众号的 access_token
        const payTemplateText = await ctx.service.order.tmessage.orderStrutsChangeMessageForUser({ 
          clint_id: order.clint_id, 
          store_name: order.store_name, 
          orderstruts: ORDER_STRUTS.SELLER_EXCEP, 
          total_fee: order.total_fee,
          time_end: ctx.NOW.toDatetime(),
          closing: '因不可抗力因素，商家无法完成此单，您可以对订单进行退费，十分抱歉!',
          gzh_access_token });
        ctx.logger.info('【Template Message】出单提示模板消息通知 => ', JSON.stringify(payTemplateText));
      }

      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 商家宣布出单
   *  - 如果是配送单, 上一个状态必须是 "knight_take" 骑手已接单, 或者是 "seller_take" 商家已接单（商家可以临时调整骑手未接的单自己配送）; 
   *  - 如果是 堂食/自取 单, 则上一状态必须是 "seller_take" (商户已接单);
   * 前置状态: seller_take(商家已接单), knight_take(骑手已接单)
   * 后置状态: seller_done
   */
  async publish({seller_id, out_trade_no, update_at, historyTag = ''}) {
    const { ctx } = this;
    // 获取操作用户
    // const transaction = await ctx.model.transaction(); // 事务
    try {
      const sequelize = ctx.model;
      const { Order } = sequelize;
      // 1. 查询当前订单状态
      let order = await Order.findOne({
        attributes: ['client_id', 'store_name', 'total_fee', 'use_pattern', 'orderstruts'],
        where: {
          out_trade_no,
          store_id: seller_id,
          update_at,
        },
        raw: true,
      });
      if (!order) {
        return ctx.message.storeOrder.orderInvalid({seller_id, out_trade_no, update_at}, '商家出单, 未查询到条件满足的订单');
      }
      order = JSON.parse(JSON.stringify(order));
      // 如果是配送单, 上一个状态必须是 "knight_take" 骑手已接单, 或者是 "seller_take" 商家已接单（商家可以临时调整骑手未接的单自己配送）;
      if (order.use_pattern === USE_PATTERN.DELIVERY && 
        (order.orderstruts !== ORDER_STRUTS.KNIGHT_TAKE && order.orderstruts !== ORDER_STRUTS.SELLER_TAKE )) {
          return ctx.message.storeOrder.osConditionInvalid({seller_id, out_trade_no, update_at, order}, '商家出单, 配送单, 前置订单状态不满足条件。');
      }
      // 如果是 堂食/自取 单, 则上一状态必须是 "seller_take" (商户已接单);
      else if ( (order.use_pattern === USE_PATTERN.TAKESELF || order.use_pattern === USE_PATTERN.EATIN) 
        && order.orderstruts !== ORDER_STRUTS.SELLER_TAKE
      ) {
        return ctx.message.storeOrder.osConditionInvalid({seller_id, out_trade_no, update_at, order}, '商家出单, 堂食/自取单, 前置订单状态不满足条件。');
      }
      // 其他条件则异常
      else if (
        (order.use_pattern !== USE_PATTERN.DELIVERY && order.use_pattern !== USE_PATTERN.TAKESELF && order.use_pattern !== USE_PATTERN.EATIN)
        || (order.orderstruts !== ORDER_STRUTS.SELLER_TAKE && order.orderstruts !== ORDER_STRUTS.KNIGHT_TAKE)
        ) {
        throw JSON.stringify({seller_id, out_trade_no, update_at, order, title: '商家出单, 订单状态异常!'});
      }
      // 2. 更新订单状态
      const result = await Order.update({
        orderstruts: ORDER_STRUTS.SELLER_DONE,
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.SELLER_DONE}${historyTag}`),
        update_at: ctx.NOW.toDatetime(),
        seller_done_at: ctx.NOW.toDatetime(),
      } ,{ where: {
        store_id: seller_id, out_trade_no,
        orderstruts: {[ctx.Op.or]:[ORDER_STRUTS.SELLER_TAKE, ORDER_STRUTS.KNIGHT_TAKE]},
        refund_struts: null, update_at,
      } });
      const affect_rows = result[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        return ctx.message.db.noAffectRows({ seller_id, out_trade_no, update_at }, '商家宣布出单, 订单未变更 (可能订单版本已变化)');
      }
      // 2. 消息: 出单提示
      if (order.clint_id) {
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no); // 获取公众号的 access_token
        const payTemplateText = await ctx.service.order.tmessage.orderStrutsChangeMessageForUser({ 
          clint_id: order.clint_id, 
          store_name: order.store_name, 
          orderstruts: ORDER_STRUTS.SELLER_DONE, 
          total_fee: order.total_fee,
          time_end: ctx.NOW.toDatetime(),
          closing: '商家已出单, 感谢您的耐心等待哦小主!',
          gzh_access_token });
        ctx.logger.info('【Template Message】出单提示模板消息通知 => ', JSON.stringify(payTemplateText));
      }
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 商家开始接单
   *  - 配送单, 订单状态为: "payed", 商家配送选项为: "第三方配送"。商家需要临时调整订单状态为: "商家配送", 
   *    则直接调用"商家接单"接口, 将订单状态修改为: "seller_take";
   *  - 堂食/自取单, 订单状态为: "payed", 商家自动接单选项为: "0"(关闭), 则可调用该接口, 将订单状态修改为: "seller_take";
   * 前置状态: payed (已支付)
   * 后置状态: seller_done
   */
  async orderTake({store_id, out_trade_no, update_at}) {
    const { ctx } = this;
    // 获取操作用户
    // const transaction = await ctx.model.transaction(); // 事务
    try {
      const sequelize = ctx.model;
      const { Order } = sequelize;
      // 1. 查询当前订单状态
      const order = await Order.findOne({
        attributes: ['client_id', 'store_name', 'total_fee', 'use_pattern', 'orderstruts'],
        where: {
          out_trade_no, store_id, update_at,
        },
        raw: true,
      });
      if (!order) {
        return ctx.message.storeOrder.orderInvalid({store_id, out_trade_no, update_at}, '商家接单, 未查询到条件满足的订单');
      }
      // 2. 更新订单状态
      const result = await Order.update({
        orderstruts: ORDER_STRUTS.SELLER_TAKE,
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.SELLER_TAKE}`),
        update_at: ctx.NOW.toDatetime(),
        // seller_done_at: ctx.NOW.toDatetime(),
      } ,{ where: {
        store_id, out_trade_no,
        orderstruts: ORDER_STRUTS.PAYED,
        refund_struts: null, update_at,
      } });
      const affect_rows = result[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        return ctx.message.db.noAffectRows({ store_id, out_trade_no, update_at }, '商家接单, 订单未变更 (可能订单版本已变化)');
      }
      // 2. 消息: 接单提示
      if (order.clint_id) {
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no); // 获取公众号的 access_token
        const payTemplateText = await ctx.service.order.tmessage.orderStrutsChangeMessageForUser({ 
          clint_id: order.clint_id, 
          store_name: order.store_name, 
          orderstruts: ORDER_STRUTS.SELLER_TAKE, 
          total_fee: order.total_fee,
          time_end: ctx.NOW.toDatetime(),
          closing: '商家已接单, 感谢您的耐心等待哦小主!',
          gzh_access_token });
        ctx.logger.info('【Template Message】出单提示模板消息通知 => ', JSON.stringify(payTemplateText));
      }

      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 商家完成订单 
   * (商家可完成的流程仅限: 自取/堂食)
   * 前置状态: seller_done(商家已出单)
   * 后置状态: order_done
   * 在订单完成时, 如果该订单的回款方式是 -> 打款到商家, 则自动打款至商家零钱包
   * 为避免 "回款方式" 设置误差, 为订单添加 "回款方式字段", 在预支付订单生成时记录当前的回款方式
   */
  async finish({seller_id, out_trade_no, update_at, historyTag=''}) {
    const { ctx } = this;
    // 获取操作用户
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const sequelize = ctx.model;
      const { Order, StoreIncomeRecord, XqStore, XqSubSeller, TicketOrder } = sequelize;
      // 1. 查询当前订单状态
      const order = await Order.findOne({
        attributes: [
          'client_id', 'store_id', 'area_id', 'store_name', 'total_fee', 'use_pattern', 'orderstruts', 'receivable_way',
          'payed_at', 'delivery_fee'
        ],
        where: {
          out_trade_no, store_id: seller_id, update_at,
        },
        raw: true,
      });
      if (!order) {
        return ctx.message.storeOrder.orderInvalid({store_id: seller_id, out_trade_no, update_at}, '商家完成订单, 未查询到条件满足的订单');
      }
      // 2. 更新订单状态
      const result = await Order.update({
        orderstruts: ORDER_STRUTS.ORDER_DONE,
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.ORDER_DONE}${historyTag}`),
        update_at: ctx.NOW.toDatetime(),
        order_done_at: ctx.NOW.toDatetime(),
      } ,{ where: {
        store_id: seller_id, out_trade_no,
        orderstruts: ORDER_STRUTS.SELLER_DONE,
        refund_struts: null, update_at,
      }, transaction });
      const affect_rows = result[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        return ctx.message.db.noAffectRows({ store_id: seller_id, out_trade_no, update_at }, '商家完成订单');
      }

      // 3. 写入商户收入记录
      const { client_id, store_id, area_id, delivery_fee } = order;
      const storeArea = await ctx.service.order.client.findStoreAreaInfo(order.area_id);
      const { mch_id } = storeArea.wx_merchant;
      let store = await XqStore.findOne({ where: { id: store_id }, include: [{
        model: XqSubSeller, where: { level: 'master' }
      }] });
      if (!store) {
        await transaction.rollback();
        return ctx.message.transfers.sellerNotFound({ store_id: seller_id, out_trade_no, update_at });
      }
      store = JSON.parse(JSON.stringify(store));
      const sellers = store.xq_sub_sellers;
      if (!_.isArray(sellers) || sellers.length <= 0) {
        // 未找到任何商户管理员
        await transaction.rollback();
        return ctx.message.withdrawal.sellerNotFound({ store_id: seller_id, out_trade_no, update_at }, '!_.isArray(sellers) || sellers.length <= 0');
      }
      if (sellers.length > 1) {
        // 商户管理员角色超过限定数量 > 1
        await transaction.rollback();
        return ctx.message.withdrawal.sellersOutOfLimit({ store_id: seller_id, out_trade_no, update_at }, 'sellers.length > 1');
      }
      // 获取商户管理员角色
      const seller = sellers[0];
      if (!seller) {
        await transaction.rollback();
        return ctx.message.withdrawal.sellerNotFound({ store_id: seller_id, out_trade_no, update_at }, '!seller');
      }
      if (!seller?.openid) {
        await transaction.rollback();
        return ctx.message.withdrawal.sellerNoOpenid({ store_id: seller_id, out_trade_no, update_at }, '!seller?.openid');
      }
      // 其他参数
      const { withdrawal_ratio, history_income, withdrawal_fee } = store; // store.update_at

      // 3.2 查询订单是否拥有 区域优惠券 , 若存在, 实际收益额应 加 区域优惠券的优惠额, 代表平台补贴
      const ticket = await TicketOrder.findOne({
        where: {out_trade_no, issue: 'a', store_id: seller_id},
        raw: true,
        attributes: ['id', 'fee_offset'],
      });
      let ticket_fee = 0; // 优惠券减扣部分
      if (ticket && Number(ticket.fee_offset) > 0) {
        ticket_fee = Number(ticket.fee_offset);
      }

      // 3.3 计算收益比例
      if (!_.isInteger(store.withdrawal_ratio)) {
        await transaction.rollback();
        return ctx.message.withdrawal.ratioNotInteger({ store_id: seller_id, out_trade_no, update_at, withdrawal_ratio: store.withdrawal_ratio });
      }
      // 计算实际分成金额 = (订单实际费用(payed_fee) - 扣除费用(deduct_fee)) * (分成比例(withdrawal_ratio) / 100)
      const payed_fee = order.total_fee; // 订单支付额
      const deduct_item = null;
      const deduct_fee = (delivery_fee && !isNaN(delivery_fee)) ? delivery_fee : 0; // 配送费
      const actual_fee_1 = ((payed_fee - deduct_fee) * (withdrawal_ratio / 100)); // 商家计划入账
      const actual_fee = actual_fee_1 + ticket_fee; // 商家实际入账 (累加地区优惠券补贴金额)

      // ctx.logger.info('订单金额: ', payed_fee);
      // ctx.logger.info('配送费: ', deduct_fee);
      // ctx.logger.info('分成比例: ', withdrawal_ratio, '%');
      // ctx.logger.info('区域优惠券补贴: ', ticket_fee);
      // ctx.logger.info('未补贴时应入账: ', actual_fee_1);
      // ctx.logger.info('商家最终实际入账: ', actual_fee);

      if (actual_fee >= 1) {
        const now = ctx.NOW.toDatetime();
        // 3.3 创建商户入账记录
        const sir_data = {
          id: ctx.uuid32, out_trade_no, area_id, 
          merchant_id: mch_id, store_id,
          seller_id: seller.id, client_id,
          store_ratio: withdrawal_ratio,
          payed_fee, deduct_item, deduct_fee, actual_fee,
          remark: '订单完成入账',
          payed_at: order.payed_at,
          orderdone_at: now,
          create_at: now,
        };
        const sirecord = await StoreIncomeRecord.create(sir_data, {
          transaction
        });
        if (!sirecord) {
          await transaction.rollback();
          return ctx.message.withdrawal.incomeRecordFail({ store_id: seller_id, out_trade_no, update_at, sir_data }, '!sirecord');
        }

        // 3.4 变更商户的提现数据
        const withdrawal_res = await XqStore.update({
          history_income: (history_income + actual_fee), // 原历史入账 = 原历史入账 + 本次实际收益
          withdrawal_fee: (withdrawal_fee + actual_fee), // 可提款金额 = 可提款金额 + 本次实际收益
        }, {
          where: {
            id: store.id,
            update_at: store.update_at,
          },
          transaction,
        });
        // console.log('变更商户的提现数据, 更新内容: ', {
        //   history_income: (history_income + actual_fee), // 原历史入账 = 原历史入账 + 本次实际收益
        //   withdrawal_fee: (withdrawal_fee + actual_fee), // 可提款金额 = 可提款金额 + 本次实际收益
        // });
        // console.log('变更商户的提现数据, 条件: ', {
        //   id: store.id,
        //   update_at: store.update_at,
        // });
        const withdrawal_affect_rows = withdrawal_res[0]; // 本次操作的影响行数
        if ( withdrawal_affect_rows <= 0 ) {
          await transaction.rollback();
          return ctx.message.db.noAffectRows({ store_id: seller_id, out_trade_no, update_at }, '商家完成订单,变更商户的提现数据');
        }

      }

      // 4. 记录用户下单商品, 写入用户的 "食物清单"
      const { OrderGoodsRelation, Goods, XqClientDailyfood } = ctx.model;
      // 获取购物商品列表
      const goodsList = await OrderGoodsRelation.findAll({
        where: { out_trade_no },
        include: [{ model: Goods, attributes: ['title', 'goods_pic', 'price'] }],
      });

      // 简化数据
      const rawGoodsList = JSON.parse(JSON.stringify(goodsList));
      if (_.isArray(rawGoodsList)) {
        // const rawGoodsList = goodsList.toJSON();
        for (let x = 0; x < rawGoodsList.length; x++) {
          const goodsRel = rawGoodsList[x];
          if (goodsRel.good) {
            const gcount = goodsRel.count;
            const g = goodsRel.good;
            // 记录购物清单
            const cdf_res = await XqClientDailyfood.create({
              id: ctx.uuid32, client_id, store_id,
              goods_id: goodsRel.goods_id,
              store_name: order.store_name,
              goods_name: g.title,
              goods_pic: g.goods_pic,
              price: g.price,
              gcount: gcount,
              use_percent: 100,
              pay_at: order.payed_at,
            }, { transaction });
            // 如果无法写入, 则异常
            if (!cdf_res) {
              return ctx.message.dailyfood.writeFail({ store_id: seller_id, out_trade_no, update_at });
            }
          } else {
            return ctx.message.dailyfood.noGoods({ store_id: seller_id, out_trade_no, update_at });
          }
        } // end: for
      } else {
        return ctx.message.dailyfood.noGoodsList({ store_id: seller_id, out_trade_no, update_at });
      }

      // 5. 消息: 订单完成消息提示
      if (order.clint_id) {
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no); // 获取公众号的 access_token
        const payTemplateText = await ctx.service.order.tmessage.orderStrutsChangeMessageForUser({ 
          clint_id: order.clint_id, 
          store_name: order.store_name, 
          orderstruts: ORDER_STRUTS.ORDER_DONE, 
          total_fee: order.total_fee,
          time_end: now,
          closing: '订单已完成，期待您的下次光临哦，爱你!',
          gzh_access_token });
        ctx.logger.info('【Template Message】出单提示模板消息通知 => ', JSON.stringify(payTemplateText));
      }

      await transaction.commit();
      return ctx.message.success(result);
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  async findAll({ seller_id, knight_id, client_id, out_trade_no, short_no, date_begin, date_end, order_struts, 
    is_refund, refund_struts, allowed_order_struts, hasKnight, hasClient, hasAddress,
    use_pattern, delivery_state, sort = 'date_desc', pageLimit = 20, pageIndex = 1 }) {
      const {ctx} = this;
      return await ctx.service.order.orders.findAll({ seller_id, knight_id, client_id, out_trade_no, short_no, date_begin, date_end, 
        order_struts, is_refund, refund_struts, allowed_order_struts, hasKnight, hasClient, hasAddress,
        use_pattern, delivery_state, sort, pageLimit, pageIndex });
  }

  async find({ out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore }) {
    const {ctx} = this;
    return await ctx.service.order.orders.find({ out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore });
  }

  /**
   * 查询提现数据: 历史入账、可提款额、已提款额
   * 1. 查询入账记录总额度
   * 2. 查询提款记录总额度
   * 3. 对比商户额度是否一致，若不一致进行反馈
   * 4. 返回商户提款数据
   * @param {*} param0 
   */
  async getWithdrawalStat({store_id}) {
    const { ctx } = this;
    // 获取操作用户
    const sequelize = ctx.model;
    // const transaction = await sequelize.transaction(); // 事务
    try {
      const { XqStore, XqSubSeller, StoreIncomeRecord, StoreWithdrawalRecord, ErrStoreIncomeStat } = sequelize;
      // 1. 查询商户款项数据
      let store = await XqStore.findOne({
        attributes: ['area_id', 'history_income', 'withdrawal_fee', 'withdrawaled', 'latest_withdrawal_at', 'update_at'],
        where: {id: store_id},
        include: [{ model: XqSubSeller, where: { level: 'master' } }]
      });
      if (!store) {
        // 未找到任何商户
        // await transaction.rollback();
        return ctx.message.income_stat.sellerNotFound({ store_id }, '!store');
      }
      store = JSON.parse(JSON.stringify(store));
      const sellers = store.xq_sub_sellers;
      if (!_.isArray(sellers) || sellers.length <= 0) {
        // 未找到任何商户管理员
        // await transaction.rollback();
        return ctx.message.income_stat.sellerNotFound({ store_id }, '!_.isArray(sellers) || sellers.length <= 0');
      }
      if (sellers.length > 1) {
        // 商户管理员角色超过限定数量 > 1
        // await transaction.rollback();
        return ctx.message.income_stat.sellersOutOfLimit({ store_id }, 'sellers.length > 1');
      }
      // 获取商户管理员角色
      const seller = sellers[0];
      if (!seller) {
        // await transaction.rollback();
        return ctx.message.income_stat.sellerNotFound({ store_id }, '!seller');
      }
      // 格式化上一次提现时间
      let latest_withdrawal_at = null;
      if (store.latest_withdrawal_at) {
        latest_withdrawal_at = (new Calendar(store.latest_withdrawal_at)).toDatetime();
      }
      // 2. 查询入账记录总额度
      let total_income = await StoreIncomeRecord.aggregate('actual_fee', 'sum', { where: { store_id } });
      if (_.isNaN(total_income)) {
        total_income = 0;
      }
      // console.log('========= total_income: ', total_income, typeof total_income);
      // 3. 查询已提款记录总额度
      let total_withdrawal = await StoreWithdrawalRecord.aggregate('total_fee', 'sum', { where: { store_id } });
      if (_.isNaN(total_withdrawal)) {
        total_withdrawal = 0;
      }
      // 可提款额度 (余额)计算
      const balance = total_income - total_withdrawal;
      // 4. 对比商户额度是否一致，若不一致进行反馈
      let err = null;
      if (store.history_income !== total_income) {
        // 总收益数据不一致
        err = `总收益计算不一致: {history_income: ${store.history_income}, total_income: ${total_income}}`;
        ctx.message.income_stat.historyIncomeFail({ store_id }, err); // 日志记录
      }else if (store.withdrawaled !== total_withdrawal) {
        // 已提款记录总额度数据不一致
        err = `已提款记录总额度计算不一致: {withdrawaled: ${store.withdrawal_fee}, total_withdrawal: ${total_withdrawal}}`;
        ctx.message.income_stat.withdrawalFail({ store_id }, err); // 日志记录
      }else if (store.withdrawal_fee !== balance) {
        // 可提款记录(余额)数据不一致
        err = `可提款记录(余额)不一致: {withdrawal_fee: ${store.withdrawaled}, balance: ${balance}}`;
        ctx.message.income_stat.balanceFail({ store_id }, err); // 日志记录
      }
      if (err) {
        // 对提款数据的错误计算进行反馈记录
        await ErrStoreIncomeStat.create({
          id: ctx.uuid32,
          area_id: store.area_id, store_id,
          store_income: store.history_income,
          store_withdrawal: store.withdrawal_fee,
          store_balance: store.withdrawaled,
          stat_income: total_income,
          stat_withdrawal: total_withdrawal,
          stat_balance: balance,
          desc: err,
          result_struts: '0'
        });
        return ctx.message.income_stat.statFail({
          store_id,
          total_income: store.history_income,
          total_withdrawal: store.withdrawal_fee,
          withdrawaled: store.withdrawaled,
          latest_withdrawal_at,
          update_at: store.update_at,
        });
      }
      // 5. 返回商户提款数据

      return ctx.message.success({
        store_id,
        total_income: store.history_income,
        total_withdrawal: store.withdrawal_fee,
        withdrawaled: store.withdrawaled,
        latest_withdrawal_at,
        update_at: store.update_at,
      });
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询提现记录
   * @param {*} param0 
   */
  async getWithdrawalRecords({store_id, limit=20, pageIndex=1}) {
    const { ctx } = this;
    // 获取操作用户
    const sequelize = ctx.model;
    // const transaction = await sequelize.transaction(); // 事务
    try {
      const { StoreWithdrawalRecord } = sequelize;
      // 1. 查询当前订单状态
      const options = {};
      options.limit = limit;
      options.offset = (pageIndex - 1) * limit;
      options.where = {
        store_id
      };
      options.order = [['create_at', 'DESC']];
      options.raw = true;
      const result = await StoreWithdrawalRecord.findAll(options);

      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询入账记录
   * @param {*} param0 
   */
  async getIncomeRecords({store_id, limit=20, pageIndex=1}) {
    const { ctx } = this;
    // 获取操作用户
    const sequelize = ctx.model;
    // const transaction = await sequelize.transaction(); // 事务
    try {
      const { StoreIncomeRecord } = sequelize;
      // 1. 查询当前订单状态
      const options = {};
      options.limit = limit;
      options.offset = (pageIndex - 1) * limit;
      options.where = {
        store_id
      };
      options.order = [['create_at', 'DESC']];
      options.raw = true;
      const result = await StoreIncomeRecord.findAll(options);

      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 商家提现
   * 1. 提现金额范围： 0.3 元 - 5000 元 每日
   * 2. 查询商户及商户管理员数据，比对数据一致性
   * 3. 计算提现后的商户可提现总额、剩余提现额
   * 4. 调用提现接口
   * 5. 写入提现记录
   * 6. 变更商家提现数据及修改时间
   * @param {*} param0 
   */
  async withdrawal({store_id, seller_id, total_fee, latest_withdrawal_at, update_at}) {
    const { ctx } = this;
    // 获取操作用户
    const sequelize = ctx.model;
    const transaction = await sequelize.transaction(); // 事务
    try {
      const { XqStore, XqSubSeller, StoreIncomeRecord, StoreWithdrawalRecord } = sequelize;
      // 1. 提现金额范围： 0.3 元 - 5000 元 每日
      if (total_fee < 30 || total_fee > 500000) {
        await transaction.rollback();
        return ctx.message.transfers.amountExceedingLimit({store_id, seller_id, total_fee, update_at}, '商家提现,金额必须是 0.3 元 - 5000 元/每日');
      }
      // 2. 查询商户及商户管理员数据，比对数据一致性
      let store = await XqStore.findOne({ where: { id: store_id, latest_withdrawal_at, update_at }, include: [{ 
        model: XqSubSeller, where: { id: seller_id, level: 'master' }
      }] });
      if (!store) {
        await transaction.rollback();
        return ctx.message.transfers.sellerNotFound({ store_id, seller_id, total_fee, update_at });
      }
      store = JSON.parse(JSON.stringify(store));
      const sellers = store.xq_sub_sellers;
      if (!_.isArray(sellers) || sellers.length <= 0) {
        // 未找到任何商户管理员
        await transaction.rollback();
        return ctx.message.transfers.sellerNotFound({ store_id, seller_id, total_fee, update_at }, '!_.isArray(sellers) || sellers.length <= 0');
      }
      if (sellers.length > 1) {
        // 商户管理员角色超过限定数量 > 1
        await transaction.rollback();
        return ctx.message.transfers.sellersOutOfLimit({ store_id, seller_id, total_fee, update_at }, 'sellers.length > 1');
      }
      // 获取商户管理员角色
      const seller = sellers[0];
      if (!seller) {
        await transaction.rollback();
        return ctx.message.transfers.sellerNotFound({ store_id, seller_id, total_fee, update_at }, '!seller');
      }
      if (!seller?.openid) {
        await transaction.rollback();
        return ctx.message.transfers.sellerNoOpenid({ store_id, seller_id, total_fee, update_at }, '!seller?.openid');
      }
      // 通过商家所在商圈, 获取商圈支付商户
      const storeArea = await ctx.service.order.client.findStoreAreaInfo(store.area_id);
      const { mch_id, mch_path, mch_secret } = storeArea.wx_merchant;
      // 3. 计算提现后的商户可提现总额、剩余提现额
      // 3.1. 查询入账记录总额度
      let total_income = await StoreIncomeRecord.aggregate('actual_fee', 'sum', { where: { store_id } });
      if (_.isNaN(total_income)) {
        total_income = 0;
      }
      // console.log('========= total_income: ', total_income, typeof total_income);
      // 3.2. 查询已提款记录总额度
      let total_withdrawal = await StoreWithdrawalRecord.aggregate('total_fee', 'sum', { where: { store_id } });
      if (_.isNaN(total_withdrawal)) {
        total_withdrawal = 0;
      }
      // 可提款额度 (余额)计算
      const balance = total_income - total_withdrawal;
      // 3.3 核对账目
      let err = null;
      if (store.history_income !== total_income) {
        // 总收益数据不一致
        await transaction.rollback();
        err = `总收益计算不一致: {history_income: ${store.history_income}, total_income: ${total_income}}`;
        return ctx.message.transfers.historyIncomeFail({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
         }, err); // 日志记录
      }else if (store.withdrawaled !== total_withdrawal) {
        // 已提款记录总额度数据不一致
        await transaction.rollback();
        err = `已提款记录总额度计算不一致: {withdrawaled: ${store.withdrawal_fee}, total_withdrawal: ${total_withdrawal}}`;
        return ctx.message.transfers.withdrawalFail({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
         }, err); // 日志记录
      }else if (store.withdrawal_fee !== balance) {
        // 可提款记录(余额)数据不一致
        await transaction.rollback();
        err = `可提款记录(余额)不一致: {withdrawal_fee: ${store.withdrawaled}, balance: ${balance}}`;
        return ctx.message.transfers.balanceFail({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance }, err); // 日志记录
      }
      // 计算 提款之后的新的 可提款额, 已提款额, 提款时间
      const now = ctx.NOW.toDatetime();
      const new_withdrawal_fee = store.withdrawal_fee - total_fee; // 新的 可提款额 = 旧的可提款额 - 本次提款额
      const new_withdrawald = total_withdrawal + total_fee; // 新的 已提款额 = 旧的已提款额 + 本次提款额
      const new_withdrawal_at = now;
      if (new_withdrawal_fee < 0) {
        // 提款额不得大于实际可提款额度
        await transaction.rollback();
        return ctx.message.transfers.withdrawalExceedingBalance({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
        });
      }
      if (new_withdrawald > total_income) {
        // 已提款额不得大于 实际总入账额(历史入账)
        await transaction.rollback();
        return ctx.message.transfers.withdrawaledExceedingIncome({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
        });
      }
      // 4. 调用提现接口
      const transfers_data = {
        mch_appid: SJAPP.Seller.appid, 
        mch_id, mch_path, mch_secret, 
        partner_trade_no: ctx.uuid32, 
        openid: seller.openid,
        amount: total_fee, 
        desc: '商户即时提现',
      };
      ctx.logger.info('[付款至商户零钱] 参数: ', transfers_data);
      const transfers_result = await ctx.service.order.unify.transfers(transfers_data);
      if (!transfers_result || !transfers_result?.data) {
        await transaction.rollback();
        return ctx.message.transfers.unknow({ store_id: seller_id, out_trade_no, update_at, transfers_data, transfers_result });
      }
      if (transfers_result.err) {
        await transaction.rollback();
        return transfers_result;
      }
      // 5. 写入提现记录
      const swrecord = await StoreWithdrawalRecord.create({
        id: ctx.uuid32, store_id, seller_id,
        seller_name: seller.username,
        seller_phonenum: seller.phonenum,
        history_fee: total_income,
        current_fee: store.withdrawal_fee, // 当前可提款总额
        total_fee, // 实际提款额
        surplus_fee: new_withdrawal_fee, // 实际剩余额
      }, { transaction });
      if (!swrecord) {
        // 写入提款记录失败
        await transaction.rollback();
        return ctx.message.transfers.databaseIOFail({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
        }, '写入提款记录失败');
      }
      // 6. 变更商家提现数据及修改时间
      const withdrawal_res = await XqStore.update({
        withdrawal_fee: new_withdrawal_fee, // 新的可提款额度
        withdrawaled: new_withdrawald, // 新的 已提款额度
        latest_withdrawal_at: new_withdrawal_at, // 最后一次提款时间
        update_at: now,
      }, {
        where: {
          id: store_id,
          latest_withdrawal_at: store.latest_withdrawal_at,
          update_at: store.update_at,
        },
        transaction,
      });
      const withdrawal_affect_rows = withdrawal_res[0]; // 本次操作的影响行数
      if ( withdrawal_affect_rows <= 0 ) {
        await transaction.rollback();
        return ctx.message.transfers.databaseIOFail({
          store_id, seller_id, total_fee, update_at, total_income, total_withdrawal, balance
        }, '变更商家提现数据及修改时间失败');
      }

      await transaction.commit();
      return ctx.message.success({
        store_id, seller_id, total_fee,
        withdrawal_fee: new_withdrawal_fee, 
        withdrawald: new_withdrawald,
        update_at: now,
      });
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 
   * @param {*} area_id 
   */
  // async tablesign(area_id) {
  //   const { ctx } = this;
  //   // 获取操作用户
  //   const { StoreTablesign } = ctx.model;
  //   try {
  //     const result = await StoreTablesign.findAll({ where: {area_id}, raw: true });
  //     return ctx.message.success(result);
  //   } catch (err) {
  //     return ctx.message.exception(err);
  //   }
  // }
}

module.exports = SellerService;
