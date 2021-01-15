'use strict';
/**
 * 模型 TicketOrder 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const Controller = require('egg').Controller;

class TicketOrderController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id, out_trade_no, ticket_id, client_id, store_id, create_at} = ctx.query;
		if (id == null || out_trade_no == null || ticket_id == null || client_id == null || store_id == null || create_at == null) {
			ctx.body = ctx.message.param.miss({id, out_trade_no, ticket_id, client_id, store_id, create_at});
			return;
		}
		ctx.body = await ctx.service.ticketOrder.findOne({id, out_trade_no, ticket_id, client_id, store_id, create_at});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {id, out_trade_no, ticket_id, client_id, store_id, create_at} = ctx.query;
		if (id == null || out_trade_no == null || ticket_id == null || client_id == null || store_id == null || create_at == null) {
			ctx.body = ctx.message.param.miss({id, out_trade_no, ticket_id, client_id, store_id, create_at});
			return;
		}
		ctx.body = await ctx.service.ticketOrder.findAll({id, out_trade_no, ticket_id, client_id, store_id, create_at});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {out_trade_no, ticket_id, client_id, store_id} = ctx.request.body;
		if (out_trade_no == null || ticket_id == null || client_id == null || store_id == null) {
			ctx.body = ctx.message.param.miss({out_trade_no, ticket_id, client_id, store_id});
			return;
		}
		ctx.body = await ctx.service.ticketOrder.add({out_trade_no, ticket_id, client_id, store_id});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, out_trade_no, ticket_id, client_id, store_id} = ctx.request.body;
		if (id == null || (out_trade_no == null && ticket_id == null && client_id == null && store_id == null)) {
			ctx.body = ctx.message.param.miss({id, out_trade_no, ticket_id, client_id, store_id});
			return;
		}
		ctx.body = await ctx.service.ticketOrder.update({id, out_trade_no, ticket_id, client_id, store_id});
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
		ctx.body = await ctx.service.ticketOrder.remove({ id });
	}

}
module.exports = TicketOrderController;
