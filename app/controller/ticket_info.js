'use strict';
/**
 * 模型 TicketInfo 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const Controller = require('egg').Controller;

class TicketInfoController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id} = ctx.query;
		if (id == null) {
			ctx.body = ctx.message.param.miss({id});
			return;
		}
		ctx.body = await ctx.service.ticketInfo.findOne({id});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {store_id, area_id, issue, category, title, period_begin, period_end, query_day, struts} = ctx.query;
		if (store_id == null && area_id == null && issue == null && category == null && title == null && 
			period_begin == null && period_end == null && query_day == null && struts == null) {
			ctx.body = ctx.message.param.miss({store_id, area_id, issue, category, title, period_begin, period_end, query_day, struts});
			return;
		}
		ctx.body = await ctx.service.ticketInfo.findAll({store_id, area_id, issue, category, title, period_begin, period_end, query_day, struts});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, count_pull} = ctx.request.body;
		if ((store_id == null && area_id == null) || issue == null || category == null || title == null || period_begin == null || period_end == null || fee_max == null || fee_offset == null) {
			ctx.body = ctx.message.param.miss({store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, count_pull});
			return;
		}
		ctx.body = await ctx.service.ticketInfo.add({store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, count_pull});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, struts} = ctx.request.body;
		if (id == null || (store_id == null && area_id == null && issue == null && category == null && title == null && desc == null 
			&& period_begin == null && period_end == null && fee_max == null && fee_offset == null && count_max == null && struts == null)) {
			ctx.body = ctx.message.param.miss({id, store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, struts});
			return;
		}
		ctx.body = await ctx.service.ticketInfo.update({id, store_id, area_id, issue, category, title, desc, period_begin, period_end, fee_max, fee_offset, count_max, struts});
	}

	// 删除模型的方法
	async remove() {
		const {ctx} = this;
		// 获取参数
		const { id } = ctx.request.body;
		if ( id == null ) {
			ctx.body = ctx.message.param.miss({ id });
			return;
		}
		ctx.body = await ctx.service.ticketInfo.remove({ id });
	}

}
module.exports = TicketInfoController;
