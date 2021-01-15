'use strict';
/**
 * 模型 TicketClient 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const BaseService = require('./base/base');

class TicketClientService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.TicketClient;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketClient} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			let {id, client_id, ticket_id, struts, used_at, create_at} = option;
			const include = [];
			const where = _.omitBy(option, _.isNil);
			const info = await TicketClient.findOne({ where });
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
		const {TicketClient} = sequelize;
		let {id, client_id, ticket_id, struts, used_at, create_at, pindex, limit} = option;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			limit = (_.isInteger(limit) && limit > 0) ? Number(limit): 20;
			pindex = (_.isInteger(pindex) && pageIndex > 0) ? Number(pindex): 1;
			const offset = (Number(pindex) - 1) * limit;
			const where = _.omitBy(option, _.isNil);
			const orderby = [['create_at', 'DESC']];
			const include = [];
			const list = await TicketClient.findAll({where, order: orderby, offset, limit });
			if (!_.isArray(list) || list.length === 0) {}
			// await transaction.commit();
			return ctx.message.success(list);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 新增模型的方法
	async add(ticketClient) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketClient} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {client_id, ticket_id, struts, used_at} = ticketClient
		try{
			let inputArgs = _.omitBy({client_id, ticket_id, struts, used_at}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			// console.log('【add ticketClient】 ： ', inputArgs);
			const ticketClientInput = await TicketClient.create(inputArgs);
			if (!ticketClientInput) throw '未找到所需数据';
			// await transaction.commit();
			return ctx.message.success(ticketClientInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(ticketClient) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketClient} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, client_id, ticket_id, struts, used_at} = ticketClient;
		let msg = null, result = -1;
		try{
			result = await TicketClient.update( _.omitBy({client_id, ticket_id, struts, used_at}, _.isNil) , { where: { id } });
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
		const {TicketClient} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await TicketClient.destroy({where: {id}});
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
module.exports = TicketClientService;
