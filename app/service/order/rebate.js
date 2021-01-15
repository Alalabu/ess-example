'use strict';
/**
 * 返利的业务模型
*/

const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const SJAPP = require('../../util/client-apps');
const ORDER_STRUTS = require('../../enums/order_struts');
const BaseService = require('../base/base');

class RebateService extends BaseService {
	constructor(ctx) {
		super(ctx);
	}

	/**
   * 查询返利记录列表
   * @param {*} option 
   */
	async findRecordAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebateRecord} = sequelize;
		let {area_id, limit, pindex} = option;
		limit = (_.isInteger(limit) && limit > 0) ? Number(limit): 100;
		pindex = (_.isInteger(pindex) && pindex > 0) ? Number(pindex): 1;
		const offset = (Number(pindex) - 1) * limit;
		const where = {area_id};
		const orderby = [['create_at', 'DESC']];
    const list = await StoreAreaRebateRecord.findAll({where, order: orderby, offset, limit });
		return ctx.message.success(list);
  }

  /**
   * 查询返利规则列表
   * @param {*} option 
   */
	async findRebateAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebate} = sequelize;
		let {area_id} = option;

		const where = {area_id};
		const orderby = [['create_at', 'DESC']];
		const list = await StoreAreaRebate.findAll({ where, order: orderby });
		return ctx.message.success(list);
  }

  /**
   * 查询返利规则详情单例
   * @param {*} option 
   */
	async findRebateOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebate} = sequelize;
		let {id} = option;

		const where = {id};
		const info = await StoreAreaRebate.findOne({ where });
		return ctx.message.success(info);
  }

  // 新增模型的方法
	async add(storeAreaRebate) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebate} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, for_min, for_day, rebate_type, fee_num} = storeAreaRebate
		try{
			let inputArgs = {area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, for_min, for_day, rebate_type, fee_num};
      inputArgs.id = ctx.uuid32;
      inputArgs.struts = '1';
			inputArgs.create_at = ctx.NOW.toDatetime();
			// console.log('【add storeAreaRebate】 ： ', inputArgs);
			const storeAreaRebateInput = await StoreAreaRebate.create(inputArgs);
			// await transaction.commit();
			return ctx.message.success(storeAreaRebateInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(storeAreaRebate) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebate} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, for_min, for_day, struts, rebate_type, fee_num} = storeAreaRebate;
		let msg = null, result = -1;
		try{
      result = await StoreAreaRebate.update( _.omitBy({title, order_type, fee_max, fee_min, fee_ratio, people_num, 
        for_hour, for_min, for_day, struts, rebate_type, fee_num}, _.isNil) , { where: { id } });
			// await transaction.commit();
			const affected_rows_count = result[0];
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}

	// 删除模型的方法
	async remove({id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreAreaRebate} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await StoreAreaRebate.destroy({where: {id}});
			const affected_rows_count = result;
			// await transaction.commit();
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}
  
	/**
   * 执行返利规则, 仅限定时器调用
   * 1. 查询该 规则信息
   * 2. 初始化 已中奖的 client 列表
   * 3. 根据规则条件 {日期, 返利人数, 价格区间上限, 价格区间下限 } 查询随机订单列表
   * 4. 根据返利金额条件 {单据类型, 返利比例 } 生成待返利数据列表
   * 5. 执行返利打款
   * 6. 对返利用户进行公众号通知
   * 
   * @param {object} rebate 规则对象
   */
	async execute_rebate(rebate) {
    const {ctx} = this;
    const sequelize = ctx.model;
		const {StoreAreaRebateRecord, Order, OrderGoodsRelation, XqClient} = sequelize;
		try {
      // 1. 查询该 规则信息
      const {area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_day, rebate_type, fee_num} = rebate;
      // 2. 初始化订单查询日期
      const today = ctx.NOW;
      let begin_date, end_date;
      if (for_day === 't') {
        begin_date = today.toDate() + ' 00:00:00';
        end_date = today.toDate() + ' 23:59:59';
      } else if (for_day === 'y') {
        today.add(-1, CalendarTypes.DAY);
        begin_date = today.toDate() + ' 00:00:00';
        end_date = today.toDate() + ' 23:59:59';
      } else {
        throw 'for_day Invalid: ' + JSON.stringify(rebate);
      }
      // 3. 查询 已中奖的 client 列表
      let exclude_users = await StoreAreaRebateRecord.findAll({
        where: {area_id, order_at: {[ctx.Op.between]: [begin_date, end_date]} }, 
        attributes: ['client_id'],
        raw: true,
      });
      console.log('已中奖人 排除 名单: ', exclude_users);
      if (_.isArray(exclude_users) && exclude_users.length > 0) {
        exclude_users = exclude_users.map(eu => eu.client_id);
      }
      // 4. 根据规则条件 {日期, 返利人数, 价格区间上限, 价格区间下限, 排除的重复中奖人名单 } 查询随机订单列表
      const win_orders = await Order.findAll({
        where: {
          area_id,
          orderstruts: ORDER_STRUTS.ORDER_DONE,
          refund_struts: null,
          total_fee: {[ctx.Op.between]: [fee_min, fee_max]},
          payed_at: {[ctx.Op.between]: [begin_date, end_date]},
          client_id: {[ctx.Op.notIn]: exclude_users},
        }, 
        attributes: ['client_id', 'client_name', 'client_mobile', 'total_fee', 'payed_at'],
        // raw: true,
        // subQuery: false,
        subQuery: true,
        order: sequelize.literal('RAND()'),
        limit: people_num,
        include: [{
          model: OrderGoodsRelation, 
          where: {total_fee: {[ctx.Op.between]: [fee_min, fee_max]}},
          attributes: ['goods_id', 'total_fee'],
        }, {
          model: XqClient,
          where: {openid: {[ctx.Op.ne]: null}},
          attributes: ['openid', 'unionid'],
        }]
      });
      if (!_.isArray(win_orders) || win_orders.length === 0) {
        throw 'Has no people: ' + JSON.stringify(rebate);
      }
      
      // 5. 根据返利金额条件 {单据类型, 返利比例 } 生成待返利数据列表
      const win_users = [];
      const tmp_user = JSON.parse(JSON.stringify(win_orders));
      for (let i = 0; i < tmp_user.length; i++) {
        const t = tmp_user[i];
        const user = {
          cid: t.client_id,
          name: t.client_name,
          mobile: t.client_mobile,
          openid: t.xq_client.openid,
          unionid: t.xq_client.unionid,
          area_id, 
          payed_at: t.payed_at,
        };
        if (order_type === 'order') {
          // 整单返利
          user.rebate_fee = t.total_fee;
        } else {
          // 单商品返利
          const goods_count = t.order_goods_relations.length;
          const goods = t.order_goods_relations[~~(Math.random() * goods_count)];
          user.rebate_fee = goods.total_fee;
        }
        // 计算返现比例
        // 通过 rebate_type 判断返现方式: 按比例返现, 或返等额现金
        // rebate_type: 返现方式:r=比例,n=数值
        // , rebate_type, fee_num, fee_ratio
        if (rebate_type === 'r' && fee_ratio >= 0 && fee_ratio <= 100) {
          // 按比例返现
          user.rebate_fee = ~~((fee_ratio / 100) * user.rebate_fee);
        } else if (rebate_type === 'n' && fee_num >= 30 && fee_num <= 10000) {
          user.rebate_fee = fee_num;
        } else {
          throw '返现比例异常: ' + JSON.stringify(rebate) + '     | user: ' + JSON.stringify(user);
        }

        if (user.rebate_fee < 30) {
          user.rebate_fee = 30;
        }
        win_users.push(user);
      }
      if (!_.isArray(win_users) || win_users.length === 0) {
        throw 'parse win_user fail: ' + JSON.stringify(tmp_user);
      }
      // 6. 执行返利打款
      // 6.1 获取当前最新的公众号 accesstoken
      const gzh_access_token = await ctx.service.order.notifyprocess.getOfficialAccessToken('out_trade_no');
      // 6.2 遍历用户进行通知
      for (let i = 0; i < win_users.length; i++) {
        const user = win_users[i];
        // 对用户进行提现操作
        await this.withdrawToUser(user);
        // 2. 添加中奖名单记录
        const recordInfo = await StoreAreaRebateRecord.create({
          id: ctx.uuid32,
          area_id, client_id: user.cid, client_name: user.name,
          mobile: user.mobile, total_fee: user.rebate_fee,
          order_at: user.payed_at,
          create_at: ctx.NOW.toDatetime(),
        });
        if (!recordInfo) ctx.logger.error('添加中奖名单记录失败...' + JSON.stringify(rebate));
        // 3. 对中奖用户进行通知
        if (user.unionid) {
          // unionid 存在才可以进行通知
          await ctx.service.order.tmessage.giftMessageForUser({
            unionid: user.unionid, 
            client_name: user.name, 
            rebate_title: title, 
            total_fee: user.rebate_fee,
            gzh_access_token,
          });
        }
      }
      // 7. 对返利用户进行公众号通知
			// await Order.update({is_comment: '1'}, { where: {out_trade_no: orderComment.out_trade_no} });
			// 3. 返回审核信息
			return ctx.message.success('ok');
		} catch (error) {
			return ctx.message.exception(error);
		}
  }
  
  /**
   * 提现给用户
   * @param {*} param0 
   */
	async withdrawToUser(client) {
		const {ctx} = this;
    const sequelize = ctx.model;
    // const {StoreAreaRebateRecord} = sequelize;
    // 初始化用户数据
    const {area_id, cid, name, mobile, openid, unionid, rebate_fee} = client;
    // 通过商家所在商圈, 获取商圈支付商户
    const storeArea = await ctx.service.order.client.findStoreAreaInfo(area_id);
    const { mch_id, mch_path, mch_secret } = storeArea.wx_merchant;
    // 配置提现参数
		const transfers_data = {
      mch_appid: SJAPP.Client.appid, 
      mch_id, mch_path, mch_secret, 
      partner_trade_no: ctx.uuid32, 
      openid: openid,
      amount: rebate_fee, 
      desc: '客户活动返现',
    };
    ctx.logger.info('[付款至客户零钱] 参数: ', transfers_data);
    const transfers_result = await ctx.service.order.unify.transfers(transfers_data);
    if (!transfers_result || !transfers_result?.data) {
      throw JSON.stringify(
        ctx.message.transfers.unknow({ cid, name, mobile, openid, unionid, rebate_fee, mch_id, mch_path, mch_secret }));
    }
    if (transfers_result.err) {
      throw JSON.stringify(transfers_result);
    }
	}

}
module.exports = RebateService;
