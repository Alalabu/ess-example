'use strict';
/**
 * 模型 TicketOrder 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const BaseService = require('./base/base');

class TicketOrderService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.TicketOrder;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketOrder} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			let {id, out_trade_no, ticket_id, client_id, store_id, create_at} = option;
			const include = [];
			const where = _.omitBy(option, _.isNil);
			const info = await TicketOrder.findOne({ where });
			if (!info) throw '未找到所需数据';
			// await transaction.commit();
			return ctx.message.success(info);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 用于查询所有模型数据的方法
	async findAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketOrder} = sequelize;
		let {id, out_trade_no, ticket_id, client_id, store_id, create_at, pindex, limit} = option;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			limit = (_.isInteger(limit) && limit > 0) ? Number(limit): 20;
			pindex = (_.isInteger(pindex) && pageIndex > 0) ? Number(pindex): 1;
			const offset = (Number(pindex) - 1) * limit;
			const where = _.omitBy(option, _.isNil);
			const orderby = [['create_at', 'DESC']];
			const include = [];
			const list = await TicketOrder.findAll({where, order: orderby, offset, limit });
			if (!_.isArray(list) || list.length === 0) {}
			// await transaction.commit();
			return ctx.message.success(list);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 新增模型的方法
	async add(ticketOrder) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketOrder} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {out_trade_no, ticket_id, client_id, store_id} = ticketOrder
		try{
			let inputArgs = _.omitBy({out_trade_no, ticket_id, client_id, store_id}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			// console.log('【add ticketOrder】 ： ', inputArgs);
			const ticketOrderInput = await TicketOrder.create(inputArgs);
			if (!ticketOrderInput) throw '未找到所需数据';
			// await transaction.commit();
			return ctx.message.success(ticketOrderInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(ticketOrder) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketOrder} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, out_trade_no, ticket_id, client_id, store_id} = ticketOrder;
		let msg = null, result = -1;
		try{
			result = await TicketOrder.update( _.omitBy({out_trade_no, ticket_id, client_id, store_id}, _.isNil) , { where: { id } });
			const affected_rows_count = result[0];
			if (affected_rows_count <= 0) {
				// throw '未修改任何数据';
				return ctx.message.result.noAffect();
			}
			// await transaction.commit();
			return ctx.message.success();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 删除模型的方法
	async remove({id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketOrder} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await TicketOrder.destroy({where: {id}});
			const affected_rows_count = result;
			if (affected_rows_count <= 0) {
				// throw '未删除任何数据';
				return ctx.message.result.noAffect();
			}
			// await transaction.commit();
			return ctx.message.success();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

}
module.exports = TicketOrderService;
