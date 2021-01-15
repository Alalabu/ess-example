'use strict';
const assert = require('assert');
const _ = require('lodash');
const xml2js = require('xml2js');
const moment = require('moment');
const BaseService = require('../base/base');
const SJAPP = require('../../util/client-apps');
const APPID = SJAPP.Client.appid; // Client App
const { Calendar, CalendarTypes } = require('calendar2');

const { CacheAreaInfoKey } = require('../../util/redis-key');

const ORDER_STRUTS = require('../../enums/order_struts');
const USE_PATTERN = require('../../enums/use_pattern');
const REFUND_STRUTS = require('../../enums/refund_struts');
const DELIVERY_STRUTS = require('../../enums/delivery_struts');

const XMLBuilder = new xml2js.Builder({
  rootName: 'xml',
  headless: true,
  renderOpts: {
    pretty: false,
  },
});

/**
 * 自动补全数字, 空余部分补 0, 返回一个字符串
 * @param {*} number 数字
 * @param {*} totalCount 总位数
 */
const autoCompleNumber = (number, totalCount) => {
  assert(_.isNumber(number) && _.isNumber(totalCount), '参数必须是数字!');
  assert(number > 0, '参数[number]必须大于0!');
  const numStr = String(number);
  if (numStr.length >= totalCount) {
    return numStr;
  }
  return Array((totalCount - numStr.length)).fill('0').join('').concat(numStr);
}

/**
 * xxx 管理
 */
class ClientService extends BaseService {
  /**
   * 通过 Seller id 获取商户支付相关数据
   * @param {String} seller_id 
   */
  async findStoreAreaBySeller(seller_id) {
    const { ctx } = this;
    const cacheKey = `order.client.store_area::${seller_id}`;
    const cacheData = await this.getCache(cacheKey);
    if(cacheData) {
      console.log('redis : ', cacheData);
      return cacheData;
    }
    try {
      const { XqStore, StoreArea, WxMerchant } = ctx.model;
      const include = [{
        model: StoreArea, required: true, include: [{
          model: WxMerchant, required: true
        }]
      }];
      const store = await XqStore.findOne({ include, where: {id: seller_id} });
      const store_area = store?.store_area; // 商户的商圈
      const mch = store_area?.wx_merchant;
      if (!mch || !_.isObject(mch) || !mch?.mch_id || !mch?.mch_path || !mch?.mch_secret) {
        throw new Error('未找到支付相关支持');
      }
      await this.setCache(cacheKey, store_area, (60 * 60 * 24));
      return store_area;
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 通过 Seller id 获取商户支付相关数据
   * @param {String} area_id 
   */
  async findStoreAreaInfo(area_id) {
    const { ctx } = this;
    const cacheKey = `${CacheAreaInfoKey}::${area_id}`;
    const cacheData = await this.getCache(cacheKey);
    if(cacheData) {
      console.log('redis : ', cacheData);
      return cacheData;
    }
    try {
      const { StoreArea, WxMerchant } = ctx.model;
      const include = [{
        model: WxMerchant, required: true,
      }];
      let store_area = await StoreArea.findOne({ include, where: {id: area_id} });
      store_area = JSON.parse(JSON.stringify(store_area));
      const mch = store_area?.wx_merchant;
      if (!mch || !_.isObject(mch) || !mch?.mch_id || !mch?.mch_path || !mch?.mch_secret) {
        throw new Error('未找到支付相关支持');
      }
      await this.setCache(cacheKey, store_area, (60 * 60 * 24));
      return store_area;
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 构建递增的商户短单号
   * @param {String} seller_id 商户id
   */
  async buildStoreShortOrder(seller_id) {
    const cacheKey = `order.store.short.order::${seller_id}`;
    const cacheData = ( await this.getCache(cacheKey) ) || 0; // 若缓存不存在序列, 则从0开始计数
    const compleTotalCount = 4; // 需要补全的总位数
    const shortNumber = autoCompleNumber( Number(cacheData) + 1 , compleTotalCount); // 计算短单号补全
    await this.setCache(cacheKey, shortNumber, (60 * 60 * 12)); // 12 小时缓存
    return shortNumber;
  }

  /**
   * 用户下达预支付订单
   * @param delivery_fee 配送费
   * @param original_fee 原价格
   * @param total_fee 总价
   */
  async prepay({ openid, client_id, address_id, order_tags, remark, use_pattern, 
    seller_id, seller_name, goods_list, delivery_fee=0, origin_fee=0, total_fee,
    meal_fee=0, appointment, area_id, ticket_area, ticket_store,
  }) {
    const { ctx } = this;
    // 初始化 预约时间
    if (!appointment) {
      // 如果预约时间不存在, 则添加预约时间, 
      // 默认: 配送单 30min, 自取单: 30min, 堂食: 10min
      let add_min = 30;
      switch (use_pattern) {
        case 'delivery':
          add_min = 30
          break;
        case 'takeself':
          add_min = 20
          break;
        case 'eatin':
          add_min = 10
          break;
        default:
          break;
      }
      const appointment_time = new Calendar();
      appointment_time.add(add_min, CalendarTypes.MINUTES);
      appointment = appointment_time.toDatetime();
    }

    // 验证使用模式 use_pattern 是否匹配
    // if (USE_PATTERN.indexOf(use_pattern) < 0) throw new Error('错误的订单使用模式');
    // 验证商品列表
    if (!_.isArray(goods_list) || goods_list.length <= 0) {
      return ctx.message.clientOrder.noGoodsList(goods_list);
    }
    // 0. 数据模型定义
    const sequelize = ctx.model;
    const { Order, OrderGoodsRelation, Address, XqClient, XqStore, Goods, TicketOrder } = sequelize;
    // 1. 如果是配送单, 则获取用户的地址数据
    let client_name = null, client_gender = null, client_mobile = null, client_area_scope = null, client_address_detail = null;
    if (address_id && use_pattern === 'delivery') {
      const address = await Address.findOne({ where: { id: address_id }, raw: true });
      if (!address) {
        return ctx.message.clientOrder.noAddress({out_trade_no, client_id, address_id, use_pattern, time: ctx.NOW.toDatetime()});
      }
      client_name = address.username;
      client_gender = address.gender;
      client_mobile = address.mobile;
      client_area_scope = address.area_scope;
      client_address_detail = address.detail;
    } else {
      const client = await XqClient.findOne({ where: { id: client_id }, raw: true });
      client_name = client.username;
      client_gender = client.gender;
      client_mobile = client.phonenum;
    }
    // 开启事务
    const transaction = await ctx.model.transaction();
    try {
      // 1. 查询最低消费限额是否匹配
      const storeInfo = await XqStore.findOne({
        attribudes: ['zeronorm'],
        where: { id: seller_id }, raw: true,
      });
      const goods_fee = total_fee - delivery_fee; // 商品价格 = 总价-配送费
      const zeronorm = (storeInfo && storeInfo.zeronorm) ? storeInfo.zeronorm : 0;
      if (goods_fee < zeronorm) {
        // 商品价格小于 最低消费限额
        return ctx.message.exception(`不能小于最低消费限额 ￥${(zeronorm/100)}元!`);
      }
      // 判断商品列表数据的剩余销售数量是否满足条件
      const goods_ids = goods_list.map(g => g.goods_id);
      const goodsListData = await Goods.findAll({
        where: { id: {[ctx.Op.in]: goods_ids} }, raw: true, attribudes: ['id', 'day_amount'],
      });
      if (!_.isArray(goodsListData) || goodsListData.length <= 0) throw '商品数量查询异常';
      const lackGoods = []; // 数量缺少的商品列表
      goodsListData.forEach( g => {
        const currGoods = goods_list.find( cg => (cg.goods_id === g.id));
        if (g.day_amount - currGoods.count < 0) {
          lackGoods.push(Object.assign(currGoods, {day_amount: g.day_amount}));
        }
      });
      // 如果 lackGoods 中存在数据, 说明商品数量不符合要求
      if (lackGoods.length > 0) {
        return ctx.message.prepay.goodsLack(JSON.stringify(lackGoods));
      }
      // 对商品剩余数量进行变更
      for (let g of goods_list) {
        // const goods = {
        //   id: ctx.uuid32, out_trade_no, goods_id: g.goods_id, goods_title: g.goods_title, 
        //   total_fee: g.total_fee, origin_fee: g.origin_fee, count: g.count,
        // };
        const affect_row = await Goods.update({
          day_amount: sequelize.literal(`day_amount - ${g.count}`),
          amount: sequelize.literal(`amount + ${g.count}`),
        }, {
          where: {id: g.goods_id},
          transaction
        });
        if (affect_row[0] == 0) throw '减少商品库存失败';
      }
      // 缓存1: 商户对应的商圈中, 支付id
      // const storeArea = await this.findStoreAreaBySeller(seller_id);
      const storeArea = await this.findStoreAreaInfo(area_id);
      // const receivable_way = storeArea.receivable_way; // 订单回款方式
      const receivable_way = null; // 订单回款方式
      const {mch_id, mch_path, mch_secret} = storeArea.wx_merchant;
      // 1. 调用微信预支付订单
      const spbill_create_ip = ctx.request.ip;
      const body = seller_name; // 支付(商品/商家)简单描述
      const detail = null; // 商品详细描述
      const attach = appointment; // 附加数据, 支付通知时原样返回, 预定时间
      const out_trade_no = ctx.uuid32;
      const notify_url = 'https://g.she-u.cn/order/client_pay/pay_notify'; // 通知地址
      const perpay_result = await ctx.service.order.unify.prepay({
        appid: APPID, mch_id, mch_path, mch_secret, device_info: 'xcx',
        body, detail, attach, out_trade_no, total_fee, spbill_create_ip, openid, notify_url});
      if(perpay_result.err) {
        // 预支付请求出错
        return perpay_result;
      }
      // 2. 用于在缓存中生成该商户的短单号
      const short_no = await this.buildStoreShortOrder(seller_id); // 短单号
      // 2. 生成用户预支付订单
      await Order.create({
        out_trade_no, short_no, client_id, address_id,
        client_name, client_gender, client_mobile, client_area_scope, client_address_detail,
        store_id: seller_id, store_name: seller_name, area_id: storeArea.id,
        orderstruts: ORDER_STRUTS.PREPAY,
        historystruts: ORDER_STRUTS.PREPAY,
        total_fee, origin_fee, delivery_fee,
        tags: order_tags, remark, use_pattern,
        prepay_at: ctx.NOW.toDatetime(), 
        update_at: ctx.NOW.toDatetime(),
        meal_fee, appointment, receivable_way,
      }, { transaction });
      // 初始化商品总额
      let goods_total_fee = 0;
      // 3. 写入订单商品关联
      for (let g of goods_list) {
        const goods = {
          id: ctx.uuid32, out_trade_no, goods_id: g.goods_id, goods_title: g.goods_title, 
          total_fee: g.total_fee, origin_fee: g.origin_fee, count: g.count,
        };
        goods_total_fee += (g.total_fee * g.count);
        await OrderGoodsRelation.create(goods, { transaction });
      }
      // 4. 记录订单优惠券使用情况 TicketOrder
      if (ticket_area != null && typeof ticket_area === 'object') {
        // 区域优惠券记录
        const {id, issue, fee_max, fee_offset} = ticket_area;
        const w_ta_res = await TicketOrder.create({
          id: ctx.uuid32,
          out_trade_no,
          ticket_id: id,
          client_id,
          store_id: seller_id,
          issue, fee_max, fee_offset, 
          total_fee,
          goods_fee: goods_total_fee,
          create_at: ctx.NOW.toDatetime(),
        }, { transaction });
      }
      if (ticket_store != null && typeof ticket_store === 'object') {
        // 商家优惠券记录
        const {id, issue, fee_max, fee_offset} = ticket_store;
        const w_ts_res = await TicketOrder.create({
          id: ctx.uuid32,
          out_trade_no,
          ticket_id: id,
          client_id,
          store_id: seller_id,
          issue, fee_max, fee_offset, 
          total_fee,
          goods_fee: goods_total_fee,
          create_at: ctx.NOW.toDatetime(),
        }, { transaction });
      }
      // 5. 提交事务并返回结果
      await transaction.commit();
      return perpay_result;
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 用户退费申请
   */
  async refund({ seller_id, out_trade_no, update_at }) {
    const { ctx } = this;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 变更订单中的退费状态为: 退费申请中
      // 退费时机: timeout, seller_excep, knight_fail??, payed??
      const sequelize = ctx.model;
      const { Order, OrderGoodsRelation, Goods } = sequelize;
      // 1.1 订单查询
      const order = await Order.findOne({ where: {out_trade_no}, raw: true });
      // 1.2 退费状态变更
      const refund_res = await Order.update({
        refund_struts: REFUND_STRUTS.REFUND_APPLY,
        refund_fee: order.total_fee,
        update_at: ctx.NOW.toDatetime(),
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${REFUND_STRUTS.REFUND_APPLY}`),
      }, {
        where: {
          out_trade_no, store_id: seller_id, update_at,
          orderstruts: {
            [ctx.Op.or]: [
              ORDER_STRUTS.PAYED, ORDER_STRUTS.SELLER_EXCEP, 
              ORDER_STRUTS.KNIGHT_FAIL,
            ]
          },
          refund_struts: {
            [ctx.Op.or]: [REFUND_STRUTS.REFUND_FAIL, null]
          }
        },
        transaction,
      });
      const affect_rows = refund_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await transaction.rollback();
        return ctx.message.db.noAffectRows({ seller_id, out_trade_no }, '用户退费申请,变更订单退费状态');
      }

      // 2. 获取退费相关的支付支持
      const storeArea = await this.findStoreAreaBySeller(seller_id);
      const {mch_id, mch_path, mch_secret} = storeArea.wx_merchant;
      // 3. 调用微信退费
      const out_refund_no = ctx.uuid32; // 附加数据, 支付通知时原样返回
      const notify_url = 'https://g.she-u.cn/order/client_pay/refund_notify'; // 通知地址
      const total_fee = order.total_fee;
      const refund_fee = order.total_fee;
      // 调用退费请求
      const refund_result = await ctx.service.order.unify.refund({
        appid: APPID, mch_id, mch_path, mch_secret,
        out_trade_no, out_refund_no, total_fee, refund_fee, notify_url});
      if(refund_result.err) {
        // 退费请求出错
        await transaction.rollback();
        return refund_result;
      }
      // 1.查询订单中的商品列表(及数量), 返还库存
      const goodsList = await OrderGoodsRelation.findAll({ where: {out_trade_no}, raw: true });
      if (_.isArray(goodsList)) {
        for (let i = 0; i < goodsList.length; i++) {
          const g = goodsList[i];
          const affect_row = await Goods.update({
            day_amount: sequelize.literal(`day_amount + ${g.count}`),
            amount: sequelize.literal(`amount - ${g.count}`),
          }, {
            where: {id: g.goods_id},
            transaction
          });
          if (affect_row[0] == 0) throw '返还商品库存失败';
        }
      }
      // 2. 对 商家/骑手 进行退费提醒
      // 获取公众号的 access_token
      // const gzh_access_token = await ctx.service.notifyprocess.getOfficialAccessToken(out_trade_no);
      // setTimeout(async () => {
      //   // 向用户发送模板消息
      //   const payTemplateText = await ctx.service.tmessage.payMessageForUser({
      //     openid, orderInfo, total_fee, time_end: appointment, gzh_access_token
      //   });
      //   ctx.logger.info('【payInform】用户支付通知结果 => ', JSON.stringify(payTemplateText));
      //   // 向商户下的所有操作员发送订单消息
      //   const templateSellerText = await ctx.service.tmessage.payMessageForSeller({ 
      //     orderInfo, total_fee, time_end: appointment, gzh_access_token
      //   });
      //   ctx.logger.info('【payInform】商户支付通知结果 => ', JSON.stringify(templateSellerText));
      //   // 如果是配送单, 则给骑手发送通知
      //   if (orderInfo.use_pattern === 'delivery') {
      //     const templateSellerText = await ctx.service.tmessage.payMessageForKnight({ 
      //       orderInfo, total_fee, time_end: appointment, gzh_access_token
      //     });
      //     ctx.logger.info('【payInform】骑手支付通知结果 => ', JSON.stringify(templateSellerText));
      //   }
      // }, 0);
      
      // 4. 提交事务
      await transaction.commit();
      return refund_result;
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }
  /**
   * 取消/关闭订单
   * - 订单支付失败时, 用户可选项有: 重新支付 or 取消订单
   * - 取消订单: 直接将该订单关闭
   * - 重新支付: 将原订单关闭, 以原订单数据发起新的支付过程
   */
  async closeorder({ client_id, seller_id, out_trade_no, update_at }) {
    const { ctx } = this;
    // 获取操作用户
    const transaction = await ctx.model.transaction(); // 事务
    const sequelize = ctx.model;
    const { Order, OrderGoodsRelation, Goods } = sequelize;
    try {
      // 1.查询订单中的商品列表(及数量), 返还库存
      const goodsList = await OrderGoodsRelation.findAll({ where: {out_trade_no}, raw: true });
      if (_.isArray(goodsList)) {
        for (let i = 0; i < goodsList.length; i++) {
          const g = goodsList[i];
          const affect_row = await Goods.update({
            day_amount: sequelize.literal(`day_amount + ${g.count}`),
            amount: sequelize.literal(`amount - ${g.count}`),
          }, {
            where: {id: g.goods_id},
            transaction
          });
          if (affect_row[0] == 0) throw '返还商品库存失败';
        }
      }
      // 2.更新订单数据
      const close_res = await Order.update({
        orderstruts: ORDER_STRUTS.ORDER_CLOSE,
        order_close_at: ctx.NOW.toDatetime(),
        update_at: ctx.NOW.toDatetime(),
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.ORDER_CLOSE}`),
      }, {
        where: {
          out_trade_no, client_id, 
          store_id: seller_id, update_at,
          orderstruts: {[ctx.Op.or]:[ORDER_STRUTS.PAY_FAIL, ORDER_STRUTS.PREPAY]}
        }, transaction,
      });
      const affect_rows = close_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await transaction.rollback();
        return ctx.message.db.noAffectRows({ client_id, seller_id, out_trade_no, update_at }, '关闭订单时');
      }
      // console.log('关闭订单结果: ', close_res);
      // 发起微信订单关闭
      const storeArea = await this.findStoreAreaBySeller(seller_id);
      const {mch_id, mch_secret} = storeArea.wx_merchant;
      const close_result = await ctx.service.order.unify.orderClose({
        appid: APPID, mch_id, mch_secret, out_trade_no
      })
      if(close_result.err) {
        // 关闭订单请求出错
        await transaction.rollback();
        return close_result;
      }
      await transaction.commit();
      return ctx.message.success();
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 订单重新支付
   * - 将该订单作为原始订单, 关闭
   * - 创建新的订单预支付
   */
  async payagain({ openid, client_id, seller_id, out_trade_no, update_at }) {
    const { ctx } = this;
    // 获取操作用户
    // const transaction = await ctx.model.transaction(); // 事务
    const { Order, OrderGoodsRelation } = ctx.model;
    try {
      // 1. 查询原始订单
      const origin_order = await Order.findOne({ where: { client_id, store_id: seller_id, out_trade_no } });
      if (! origin_order ) return ctx.message.db.noQueryRows({ client_id, seller_id, out_trade_no }, '订单重新支付,订单数据为空!');
      const origin_ogrs = await OrderGoodsRelation.findAll({ where: { out_trade_no }, raw: true });
      if (!_.isArray(origin_ogrs) || origin_ogrs.length <= 0 ) {
        return ctx.message.db.noQueryRows({ client_id, seller_id, out_trade_no }, '订单重新支付,订单商品关联数据为空!');
      }
      // 2. 关闭原始订单
      const close_res = await this.closeorder({ client_id, seller_id, out_trade_no, update_at });
      if (close_res.err) {
        return close_res;
      }
      // 3. 发起新的预支付流程
      const { address_id, tags, remark, use_pattern, area_id,
        store_name, delivery_fee, origin_fee, total_fee, meal_fee, appointment,
      } = origin_order;
      // appointment = 预定时间, moment 做格式转换
      const format_appointment = (appointment == null ? null : moment(appointment).format('YYYY-MM-DD HH:mm'));

      // 预定时间和餐盒费
      const prepay_res = await this.prepay({ openid, client_id, address_id, order_tags: tags, remark, use_pattern, 
        seller_id, seller_name: store_name, goods_list: origin_ogrs, delivery_fee, origin_fee, total_fee,
        meal_fee, appointment: format_appointment, area_id,
      });
      return prepay_res;
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 生成打印文本
   * @param {*} param0 
   */
  getPrintString({ shortNo, out_trade_no, use_pattern, appointment, goodsList, total_fee, tags, remark, create_at,
    client_name, client_gender, client_mobile, client_area_scope, client_address_detail
  }) {
    let orderInfo = '';
    orderInfo += "<CB>社有食纪</CB><BR>";//标题字体如需居中放大,就需要用标签套上
    orderInfo += `<CB>${shortNo}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `<CB>〓 ${use_pattern} 〓</CB><BR>`;
    orderInfo += `预约时间：${appointment}<BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `订单号: ${out_trade_no}<BR>`;
    orderInfo += "--------------------------------<BR>";
    for(let goods of goodsList){
      orderInfo += "商品名称："+ goods.goods_title +"<BR>";
      orderInfo += "数量："+ goods.count+ "　单价:"+ goods.total_fee/100+ "　价格:"+ (goods.total_fee * goods.count)/100+ "<BR><BR>"
    }
    orderInfo += "--------------------------------<BR>";
    orderInfo += `标注：${ tags }<BR>`;
    orderInfo += `备注：${ remark }<BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += "实付："+ total_fee/100 +"元<BR>";
    orderInfo += "下单时间："+ create_at +"<BR><BR>";
    orderInfo += "--------------------------------<BR>";
    orderInfo += `用户：${client_name}<BR>`;
    orderInfo += `电话：${client_mobile}<BR>`;
    if (client_area_scope) {
      orderInfo += `区域：${client_area_scope}<BR>`;
    }
    if (client_address_detail) {
      orderInfo += `地址：${client_address_detail}<BR>`;
    }

    orderInfo += "<QR>http://weixin.qq.com/r/nxPSyo3ENdBKrcmp90aN</QR>";
    return orderInfo;
  }

  /**
   * 支付通知
   * @param {*} informData 
   */
  async payNotify(informData) {
    const { ctx } = this;
    let isCommit = false;
    // 
    ctx.logger.info('service.payNotify.informData : ', informData);
    // 参数判定
    if(informData.return_code !== 'SUCCESS') {
      return ctx.message.notify.fail(informData, '用户支付');
    }
    // 正常返回数据
    const { appid, mch_id, openid, is_subscribe, total_fee, cash_fee,
      transaction_id, out_trade_no, attach, time_end } = informData;
    // Redis 响应重复性处理
    const cacheKey = `order.client.payNotify::${out_trade_no}`;
    const cacheData = await this.getCache(cacheKey); // 若缓存不存在序列, 则从0开始计数
    if (cacheData) {
      return ctx.message.notify.pending({out_trade_no, openid, attach, time_end});
    }
    await this.setCache(cacheKey, out_trade_no, (60 * 5)); // 5分钟缓存
    // 获取操作用户
    const transaction = await ctx.model.transaction(); // 事务
    const sequelize = ctx.model;
    const { Order, OrderGoodsRelation, XqStore, XqSubSeller } = sequelize;
    try {
      // 1. 支付状态变更: 支付成功
      let orderstruts = null;
      if(informData.result_code === 'SUCCESS') {
        orderstruts = ORDER_STRUTS.PAYED;
      } else {
        orderstruts = ORDER_STRUTS.PAY_FAIL;
      }
      // 1. 修改订单状态
      const prepay_res = await Order.update({
        orderstruts, 
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${orderstruts}`),
        payed_at: ctx.NOW.toDatetime(),
        update_at: ctx.NOW.toDatetime(),
      }, {
        where: {
          out_trade_no, orderstruts: ORDER_STRUTS.PREPAY,
          payed_at: null, total_fee,
        },
        transaction,
      });
      const affect_rows = prepay_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
        await transaction.rollback();
        return ctx.message.db.noAffectRows({ openid, out_trade_no, total_fee, attach, time_end }, '支付成功通知时,修改订单状态.');
      }
      // 4. 提交事务
      await transaction.commit();
      isCommit = true;
      if(informData.result_code !== 'SUCCESS') {
        // 支付失败, 则直接返回响应
        return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
      }
      // 3. 获取订单信息
      let thisOrder = await Order.findOne({
        attribudes: ['short_no', 'appointment', 'total_fee', 'tags', 'use_pattern', 'remark', 'create_at',
          'client_name', 'client_gender', 'client_mobile', 'client_area_scope', 'client_address_detail',
          'update_at',
        ],
        where: { out_trade_no },
        include: [{
          model: OrderGoodsRelation, required: true, attribudes: ['goods_title', 'total_fee', 'count']
        }, {
          model: XqStore, required: true, attribudes: ['printer_no', 'auto_takeorder', 'delivery_state'],
        }]
      });
      if (!thisOrder) {
        // await transaction.rollback();
        return ctx.message.storeOrder.orderInvalid({ out_trade_no }, '用户支付成功, 但未查询到条件满足的订单');
      }
      /**
       * 自动接单流程
       * 条件1: 支付成功后, 如果商户开启自动接单, 并且订单为堂食或者自取单, 则订单状态直接变更为状态 "seller_take" (商户已接单);
       * 条件2: 支付成功后, 如果商户开启自动接单, 并且订单使用方式为"配送单", 且商家配送方式为开启"商家配送", 
       *        则订单状态直接变更为状态 "seller_take" (商户已接单);
       */
      if (thisOrder.xq_store.auto_takeorder === '1'
        && (
          (thisOrder.use_pattern === USE_PATTERN.TAKESELF || thisOrder.use_pattern === USE_PATTERN.EATIN)
          ||
          (thisOrder.use_pattern === USE_PATTERN.DELIVERY && thisOrder.xq_store.delivery_state === DELIVERY_STRUTS.SELLER)
        )
      ) {
        const seller_take_res = await Order.update({
          orderstruts: ORDER_STRUTS.SELLER_TAKE, 
          historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.SELLER_TAKE}`),
          update_at: ctx.NOW.toDatetime(),
        }, {
          where: {
            out_trade_no, 
            orderstruts: ORDER_STRUTS.PAYED,
            update_at: thisOrder.update_at,
          },
          // transaction,
        });
        const seller_take_affect_rows = seller_take_res[0]; // 本次操作的影响行数
        if ( seller_take_affect_rows <= 0 ) {
          await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
          // await transaction.rollback();
          return ctx.message.db.noAffectRows({ out_trade_no, thisOrder }, '支付成功通知时, 订单在转为自取单时出错, 修改订单状态未影响行数.');
        }
      }
      // 4. 提交事务
      // await transaction.commit();

      // 判断是否有商品
      if (thisOrder.order_goods_relations) {
        // 3. 发送打印机命令
        thisOrder = JSON.parse(JSON.stringify(thisOrder));
        const goodsList = thisOrder.order_goods_relations;
        const { short_no, appointment, total_fee, tags, remark, use_pattern, create_at,
          client_name, client_gender, client_mobile, client_area_scope, client_address_detail,
        } = thisOrder;
        const printer_no = thisOrder.xq_store.printer_no;
        if (printer_no) {
          try {
            let use_pattern_text = '';
            switch (use_pattern) {
              case 'delivery':
                use_pattern_text = '骑手配送';
                break;
              //
              case 'takeself':
                use_pattern_text = '自取单';
                break;
              //
              case 'eatin':
                use_pattern_text = '堂食';
                break;
              default:
                break;
            }
            const orderInfo = this.getPrintString({ shortNo: short_no, out_trade_no, 
              appointment: (new Calendar(appointment)).toDatetime(),
              use_pattern: use_pattern_text,
              goodsList,
              total_fee, tags, remark, 
              create_at: (new Calendar(create_at)).toDatetime(),
              client_name, client_gender, client_mobile, client_area_scope, client_address_detail,
            });
            const sn1 = printer_no;
            const print_res = await ctx.service.order.printer.printing(sn1, orderInfo);
            ctx.logger.info(`订单[${out_trade_no}]打印结果: `, print_res);
          } catch (error) {
            ctx.logger.error('订单打印时, 发生异常: ', error);
          }
        } else {
          ctx.logger.info(`订单[${out_trade_no}]打印时，发现未接入打印机设备...`);
        }
      } else {
        ctx.logger.error('订单打印前, 获取订单信息失败: ', thisOrder);
      }
      

      // 2. 通知商户, 模板消息
      setTimeout(async () => {
        // 查询订单数据
        const include = [{
          model: OrderGoodsRelation, required: true, attribudes: ['goods_title', 'count']
        }, {
          model: XqStore, required: true, attribudes: ['printer_no'], include: [{
            model: XqSubSeller, where: { struts: '1' },
          }],
        }];
        const orderInfo = JSON.parse( JSON.stringify(await Order.findOne({ include, where: {out_trade_no} })) );
        
        if (!orderInfo) return ctx.logger.error('订单支付通知时的订单信息 orderInfo: ', orderInfo);
        orderInfo.goods_title = orderInfo.order_goods_relations.map( g => `${g.goods_title} x ${g.count}个`).join('，');
        // 获取公众号的 access_token
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no);
        // attach 是用户的预订单时间
        let appointment = ctx.NOW.toDatetime();
        if (attach) {
          appointment = attach;
        }
        // 向用户发送模板消息
        const payTemplateText = await ctx.service.order.tmessage.payMessageForUser({
          openid, orderInfo, total_fee, time_end: appointment, gzh_access_token
        });
        ctx.logger.info('【payInform】用户支付通知结果 => ', JSON.stringify(payTemplateText));
        // 向商户下的所有操作员发送订单消息
        // 向商户发送模板消息
        const templateSellerText = await ctx.service.order.tmessage.payMessageForSeller({ 
          orderInfo, total_fee, time_end: appointment, gzh_access_token
        });
        ctx.logger.info('【payInform】商户支付通知结果 => ', JSON.stringify(templateSellerText));
        
      }, 0);
      

      
      return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
    } catch (err) {
      await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
      if (!isCommit) {
        await transaction.rollback();
      }
      return ctx.message.exception(err);
    }
  }

  /**
   * 通过 unionid 获取用户的公众号 openid
   * @param {*} unionid 
   */
  async getOfficialOpenid(unionid) {
    const { ctx } = this;
    const header = {
      authorization: ctx.generateToken({ 
        params: { unionid },
        secret: ctx.app.config.jwt.secret,
        expiresIn: (5 * 60 * 60)
      })
    };
    const secret = '1e145f108f4711eabe3100ff9846b53f';
    const options = {
      key: '1e145f0a8f4711eabe3100ff9846b53f',
      timeStamp: ctx.timeStamp,
      nonceStr: ctx.getNonceStr(16),
      unionid: unionid,
    };
    options.sign = ctx.parseSign(options, secret);
    // 通过 unionid 换取公众号用户的 openid
    // ctx.logger.info('【支付通知】准备换取公众号 openid, options = ', options);
    // const gzhuser_result = await ctx.app.seneca("wechat", "official/user", options);
    const gzhuser_result = await ctx.curl('https://g.she-u.cn/wechat/official/user', {
      dataType: 'json', method: 'POST', data: options, headers: header
    });
    if(!gzhuser_result?.data || gzhuser_result.data.err) {
      ctx.logger.error('【支付通知】准备换取公众号失败:', gzhuser_result);
    }
    // ctx.logger.info('【支付通知】换取公众号 openid 成功: ', gzhuser_result);
    return gzhuser_result.data.data.openid;
  }

  /**
   * 获取公众号的 access_token
   * @param {*} unionid 随便给个值
   */
  async getOfficialAccessToken(unionid) {
    const { ctx } = this;
    const header = {
      authorization: ctx.generateToken({ 
        params: { unionid },
        secret: ctx.app.config.jwt.secret,
        expiresIn: (5 * 60 * 60)
      })
    };
    // 获取公众号的 access_token
    const secret = '1e145f108f4711eabe3100ff9846b53f';
    const at_options = {
      key: '1e145f0a8f4711eabe3100ff9846b53f',
      timeStamp: ctx.timeStamp, nonceStr: ctx.getNonceStr(16),
    };
    at_options.sign = ctx.parseSign(at_options, secret);
    // 2. 获取公众号的AT
    ctx.logger.info('【支付通知】准备获取公众号的 access_token...');
    // const at_result = await ctx.app.seneca("wechat","official/accessToken", at_options);
    const at_result = await ctx.curl('https://g.she-u.cn/wechat/official/accessToken', {
      dataType: 'json', method: 'POST', data: at_options, headers: header
    });
    if(!at_result?.data || at_result.data.err) {
      ctx.logger.error('【支付通知】准备获取公众号的 access_token失败:', at_result);
    }
    ctx.logger.info('【支付通知】获取公众号的 access_token 成功: ', at_result);
    const gzh_access_token = at_result.data.data.access_token; // 公众号的 Access_Token
    return gzh_access_token;
  }

  /**
   * 向用户发送支付成功的公众号订阅模板消息
   * @param {*} config
   */
  async payMessageForUser({ openid, orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      const { XqClient } = ctx.model;
      const client = await XqClient.findOne({ where: { openid }, raw: true });
      if (!client || !client.unionid) {
        return ctx.logger.error('【payInform Template Error】(!client || !client.unionid): ', client);
      }
      // 将 unionid 转换为公众号的 openid
      const touserOpenid = await this.getOfficialOpenid(client.unionid);
      // 获取公众号的 access_token
      // const access_token = await this.getOfficialAccessToken(client.unionid);

      // 获取订单信息
      const { short_no, store_name, goods_title } = orderInfo;
      // 编辑公众号消息模板
      const post_data = {
        touser: touserOpenid,
        template_id: 'MxmuDRPbuBGVZmD9mbGNeLwZBoyAEuIo5xNes2Ah1wA',
        miniprogram: {
          appid: 'wxcf0228511283435a',
          pagepath: 'pages/guide/guide',
        },
        data: {
          first: { value: '支付成功！', color: '#173177' },
          keyword1: { value: store_name, color: '#173177' },
          keyword2: { value: short_no, color: '#DD4F42' },
          keyword3: { value: goods_title, color: '#353535' },
          keyword4: { value: `￥${total_fee / 100}`, color: '#DD4F42' },
          keyword5: { value: time_end, color: '#173177' },
          remark: { value: '您可以通过订单编号识别您购买的商品哦~', color: '#173177' },
        },
      };
      const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
      ctx.logger.info('【公众号消息模板】: ', wechatTemplateResult);
      
      return wechatTemplateResult;
    } catch (error) {
      ctx.logger.error('【payInform Template sendPaySuccessMessageForUser Exception】: ', error);
    }
  }

  /**
   * 向商户发送支付成功的公众号订阅模板消息
   * @param {*} config
   */
  async payMessageForSeller({ orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 查询订单数据
      const { short_no, goods_title, xq_store } = orderInfo;
      const { xq_sub_sellers } = xq_store; // 商户下的操作员
      for (let i = 0; i < xq_sub_sellers.length; i++) {
        const seller = xq_sub_sellers[i];
        if (seller.unionid) {
          const seller_offic_openid = await this.getOfficialOpenid(seller.unionid);
          // 编辑模板
          const post_data = {
            touser: seller_offic_openid,
            template_id: 'yuSScC1xsQ4XBtWJKHjFO2TXSlC8qTVLPnOatT0s2YU',
            // miniprogram: {
            //   appid: 'wxca2ddba40596d5de',
            //   pagepath: 'pages/guide/guide',
            // },
            data: {
              first: { value: '收到新的用户订单！', color: '#173177' },
              keyword1: { value: goods_title, color: '#353535' },
              keyword2: { value: short_no, color: '#DD4F42' },
              keyword3: { value: `￥${total_fee / 100}`, color: '#173177' },
              keyword4: { value: time_end, color: '#DD4F42' },
              keyword5: { value: '用户自取餐', color: '#173177' },
              remark: { value: '您可以通过订单编号识别您购买的商品哦~', color: '#173177' },
            },
          };
          const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
          ctx.logger.info('【payInform Template sendPaySuccessMessageForUser】: ', wechatTemplateResult);
        }
      }
      ctx.logger.info('【发送商户订单模板完成】: ', xq_sub_sellers);
      return;
    } catch (error) {
      ctx.logger.error('【发送商户订单模板 Exception】: ', error);
    }
  }

  /**
   * 发送 公众号 模板消息
   * @param {*} access_token 
   * @param {*} post_data 
   */
  async sendTemplate(access_token, post_data) {
    const { ctx } = this;
    // 发送消息模板
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
    return await ctx.curl(url, {
      dataType: 'json',
      method: 'POST',
      data: JSON.stringify(post_data),
    });
  }

  /**
   * 生成打印文本
   * @param {*} param0 
   */
  getPrintRefundString({ shortNo, out_trade_no, use_pattern, total_fee, refund_at,
    client_name, client_mobile
  }) {
    let orderInfo = '';
    orderInfo += "<CB>用户退费</CB><BR>";//标题字体如需居中放大,就需要用标签套上
    orderInfo += `<CB>${shortNo}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `<CB>〓 ${use_pattern} 〓</CB><BR>`;
    orderInfo += `退费时间：${refund_at}<BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `订单号: ${out_trade_no}<BR>`;
    orderInfo += "退费金额："+ total_fee/100 +"元<BR>";
    orderInfo += "--------------------------------<BR>";
    orderInfo += `用户：${client_name}<BR>`;
    orderInfo += `电话：${client_mobile}<BR>`;

    orderInfo += "<QR>http://weixin.qq.com/r/nxPSyo3ENdBKrcmp90aN</QR>";
    return orderInfo;
  }

  /**
   * 微信退费通知
   * @param {*} informData 
   */
  async refundNotify(informData) {
    const { ctx } = this;
    // 参数判定
    if(informData.return_code !== 'SUCCESS') {
      return ctx.message.notify.fail(informData, '用户退费');
    }
    let cacheKey = null;
    // 获取操作用户
    const transaction = await ctx.model.transaction(); // 事务
    
    try {
      // 正常返回数据
      const { appid, mch_id, nonce_str, req_info } = informData;
      const sequelize = ctx.model;
      const { Order, WxMerchant, OrderGoodsRelation, XqStore, XqSubSeller } = sequelize;
      const mch = await WxMerchant.findOne({ where: { mch_id } });
      if(!mch || !mch.mch_secret) {
        return ctx.message.refund.noMch({ appid, mch_id, nonce_str, req_info }, '退费通知');
      }
      const { mch_secret } = mch;
      const decodeXML = ctx.service.order.unify.refundDecode(req_info, mch_secret);
      const decodeInfoObject = await new Promise(resolve => {
        xml2js.parseString(decodeXML, { explicitArray: false }, (err, json) => {
          // console.log(err);
          resolve(json);
        });
      });
      const { out_trade_no, out_refund_no, total_fee, refund_fee, refund_status,
        success_time, refund_recv_accout } = decodeInfoObject.root;
      ctx.logger.info('service.refundNotify.informData : ', decodeInfoObject.root);
      // Redis 响应重复性处理
      cacheKey = `order.client.refundNotify::${out_trade_no}`;
      const cacheData = await this.getCache(cacheKey); // 若缓存不存在序列, 则从0开始计数
      if (cacheData) {
        return ctx.message.notify.pending({out_trade_no, attach, time_end});
      }
      await this.setCache(cacheKey, out_trade_no, (60 * 5)); // 5分钟缓存
      // 1. 支付状态变更: 支付成功
      let refundstruts = null; // 退款状态
      let refundwhere = null; // 退款条件
      let refund_at = null;
      if(refund_status === 'SUCCESS') {
        refundstruts = REFUND_STRUTS.REFUND_OK;
        refundwhere = {
          [ctx.Op.or]: [REFUND_STRUTS.REFUND_FAIL, REFUND_STRUTS.REFUND_APPLY]
        };
        refund_at = ctx.NOW.toDatetime();
      } else {
        refundstruts = REFUND_STRUTS.REFUND_FAIL;
        refundwhere = REFUND_STRUTS.REFUND_APPLY;
      }
      // 1. 修改订单状态
      const refund_res = await Order.update({
        refund_struts: refundstruts,
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${refundstruts}`),
        refund_at,
        update_at: ctx.NOW.toDatetime(),
      }, {
        where: {
          out_trade_no, refund_struts: refundwhere,
          refund_at: null, total_fee,
        },
        transaction,
      });
      const affect_rows = refund_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
        await transaction.rollback();
        return ctx.message.db.noAffectRows({ out_trade_no, out_refund_no, total_fee, refund_fee, refund_status,
          success_time, refund_recv_accout }, '退款通知时,修改订单状态.');
      }
      // 4. 提交状态修改
      await transaction.commit();
      if(refund_status !== 'SUCCESS') {
        // 退费失败, 则直接返回响应
        return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
      }
      // 5. 退费成功, 打印退费单
      let thisOrder = await Order.findOne({
        attribudes: ['short_no', 'total_fee', 'create_at', 'client_name', 'client_mobile' ],
        where: { out_trade_no },
        include: [{
          model: XqStore, required: true, attribudes: ['printer_no'],
        }]
      });
      if (thisOrder) {
        // 3. 发送打印机命令
        thisOrder = JSON.parse(JSON.stringify(thisOrder));
        const { short_no, total_fee, use_pattern, create_at, client_name, client_mobile } = thisOrder;
        const printer_no = thisOrder.xq_store.printer_no;
        if (printer_no) {
          try {
            let use_pattern_text = '';
            switch (use_pattern) {
              case 'delivery':
                use_pattern_text = '骑手配送';
                break;
              //
              case 'takeself':
                use_pattern_text = '自取单';
                break;
              //
              case 'eatin':
                use_pattern_text = '堂食';
                break;
              default:
                break;
            }
            const orderInfo = this.getPrintRefundString({
              shortNo: short_no, out_trade_no, 
              use_pattern: use_pattern_text,
              total_fee,
              refund_at: (new Calendar(success_time)).toDatetime(),
              client_name, client_mobile,
            });
            const sn1 = printer_no;
            const print_res = await ctx.service.order.printer.printing(sn1, orderInfo);
            ctx.logger.info(`退费订单[${out_trade_no}]打印结果: `, print_res);
          } catch (error) {
            ctx.logger.error('退费订单打印时, 发生异常: ', error);
          }
        } else {
          ctx.logger.info(`退费订单[${out_trade_no}]打印时，发现未接入打印机设备...`);
        }
      } else {
        ctx.logger.error('退费订单打印前, 获取订单信息失败: ', thisOrder);
      }

      // 3. 正常退费成功, 发送通知
      setTimeout(async () => {
        // 查询订单数据
        const include = [{
          model: OrderGoodsRelation, required: true, attribudes: ['goods_title', 'count']
        }, {
          model: XqStore, required: true, attribudes: ['printer_no'], include: [{
            model: XqSubSeller, where: { struts: '1' },
          }],
        }];
        const orderInfo = JSON.parse( JSON.stringify(await Order.findOne({ include, where: {out_trade_no} })) );

        if (!orderInfo) return ctx.logger.error('退费通知时的订单信息 orderInfo: ', orderInfo);
        orderInfo.goods_title = orderInfo.order_goods_relations.map( g => `${g.goods_title} x ${g.count}个`).join('，');
        // 获取公众号的 access_token
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no);
        // 向用户发送模板消息 无openid
        // const payTemplateText = await ctx.service.tmessage.refundMessageForUser({
        //   openid, orderInfo, total_fee, time_end: ctx.NOW.toDatetime(), gzh_access_token
        // });
        // ctx.logger.info('【payInform】用户退费通知结果 => ', JSON.stringify(payTemplateText));
        // 向商户下的所有操作员发送订单消息

        // 向商户发送模板消息
        const templateSellerText = await ctx.service.order.tmessage.refundMessageForSeller({ 
          orderInfo, total_fee: refund_fee, time_end: ctx.NOW.toDatetime(), gzh_access_token
        });
        ctx.logger.info('【payInform】商户退费通知结果 => ', JSON.stringify(templateSellerText));

        // 向骑手发送模板消息
        if (orderInfo.use_pattern === 'delivery') {
          const templateKnightText = await ctx.service.order.tmessage.refundMessageForKnight({ 
            orderInfo, total_fee: refund_fee, time_end: ctx.NOW.toDatetime(), gzh_access_token
          });
          ctx.logger.info('【payInform】骑手退费通知结果 => ', JSON.stringify(templateKnightText));
        }
        
      }, 0);

      return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
    } catch (err) {
      if(cacheKey) {
        await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
      }
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询订单列表
   * @param {*} param0 
   */
  async findAll({ client_id, out_trade_no, short_no, date_begin, date_end, order_struts, is_refund, refund_struts,
    allowed_order_struts,
    sort = 'date_desc', pageLimit = 20, pageIndex = 1 }) {
      const {ctx} = this;
      const hasStore = true;
      return await ctx.service.order.orders.findAll({ client_id, out_trade_no, short_no, date_begin, date_end,
        allowed_order_struts,
        order_struts, is_refund, refund_struts, hasStore, sort, pageLimit, pageIndex });
  }

  /**
   * 查询订单单例
   * @param {*} param0 
   */
  async find({ out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore }) {
    const {ctx} = this;
    console.log('用户端的订单查询: ', out_trade_no);
    return await ctx.service.order.orders.find({ out_trade_no, hasClient: true, hasAddress: false, 
      hasKnight: true, hasStore: true });
  }

  /**
   * 查询本日在某商户已购 (且限购) 的商品列表
   * @param {*} param0 
   */
  async findTodayGoods({ client_id, store_id }) {
    const {ctx} = this;
    const { Order, OrderGoodsRelation, Goods } = ctx.model;
    // 时间范围
    const today = new Calendar();
    const tomorrow = new Calendar();
    tomorrow.add(1, CalendarTypes.DAY);
    const begin_date = today.toDate();
    const end_date = tomorrow.toDate();
    // 查询限购并且本日已购商品列表
    const goods_list = await OrderGoodsRelation.findAll({
      attributes: ['goods_id', 'count'],
      include: [{
        model: Order, attributes: [], where: {
          client_id, store_id,
          refund_struts: null,
          orderstruts: {[ctx.Op.notIn]: ['prepay', 'pay_fail', 'order_close', 'knight_fail', 'seller_excep']},
          payed_at: {[ctx.Op.between]: [begin_date, end_date]},
        },
      }, {
        model: Goods, attributes: [], where: {glimit: {[ctx.Op.gt]: 0}}
      }],
    });

    const result = {};
    if (_.isArray(goods_list) && goods_list.length > 0) {
      // 存在则合并数据
      const raw_list = JSON.parse(JSON.stringify(goods_list));
      for (let i = 0; i < raw_list.length; i++) {
        const g = raw_list[i];
        if (result[g.goods_id] != null) {
          result[g.goods_id] += Number(g.count);
        } else {
          result[g.goods_id] = Number(g.count);
        }
      }
    }
    return ctx.message.success(result);
  }
}

module.exports = ClientService;
