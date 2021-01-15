'use strict';
/**
 * 模型 TicketInfo 的 Service
*/

const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const BaseService = require('./base/base');

class TicketInfoService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.TicketInfo;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketInfo} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			let {id} = option;
			const include = [];
			const where = {id};
			const info = await TicketInfo.findOne({ where, raw: true });
			if (!info) throw '未找到所需数据';
			if (info.period_begin) {
				info.period_begin = (new Calendar(info.period_begin)).toDate();
			}
			if (info.period_end) {
				info.period_end = (new Calendar(info.period_end)).toDate();
			}
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
		const {TicketInfo} = sequelize;
		let {store_id, area_id, issue, category, title, period_begin, period_end, query_day, struts='1'} = option;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		try{
			const where = _.omitBy({store_id, area_id, issue, category, struts}, _.isNil);
			if (title != null) {
				where.title = {[ctx.Op.like]: `%${title}%`};
			}
			if (period_begin != null) {
				where.period_begin = {[ctx.Op.lte]: period_begin};
			}
			if (period_end != null) {
				where.period_end = {[ctx.Op.gte]: period_end};
			}
			if (query_day != null) {
				where.period_begin = {[ctx.Op.lte]: query_day};
				where.period_end = {[ctx.Op.gte]: query_day};
			}
			const orderby = [['create_at', 'DESC']];
			const list = await TicketInfo.findAll({where, order: orderby, raw: true });
			if (!_.isArray(list) || list.length === 0) {}
			else {
				list.forEach(t => {
					t.period_begin = (t.period_begin != null)? (new Calendar(t.period_begin)).toDate(): null;
					t.period_end = (t.period_end != null)? (new Calendar(t.period_end)).toDate(): null;
					t.create_at = (new Calendar(t.create_at)).toDatetime();
				})
			}
			// await transaction.commit();
			return ctx.message.success(list);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 新增模型的方法
	async add(ticketInfo) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketInfo} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max} = ticketInfo
		try{
			let inputArgs = _.omitBy({store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			// console.log('【add ticketInfo】 ： ', inputArgs);
			const ticketInfoInput = await TicketInfo.create(inputArgs);
			if (!ticketInfoInput) throw '未找到所需数据';
			// await transaction.commit();
			return ctx.message.success(ticketInfoInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(ticketInfo) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {TicketInfo} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, 
			count_max, struts} = ticketInfo;
		let msg = null, result = -1;
		try{
			result = await TicketInfo.update( _.omitBy({store_id, area_id, issue, category, title, desc, period_begin, period_end, 
				fee_max, fee_offset, count_max, struts}, _.isNil) , { where: { id } });
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
		const {TicketInfo} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await TicketInfo.destroy({where: {id}});
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
module.exports = TicketInfoService;
