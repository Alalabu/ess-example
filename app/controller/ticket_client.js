'use strict';
/**
 * 模型 TicketClient 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const Controller = require('egg').Controller;

class TicketClientController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id, client_id, ticket_id, struts, used_at, create_at} = ctx.query;
		if (id == null || client_id == null || ticket_id == null || struts == null || used_at == null || create_at == null) {
			ctx.body = ctx.message.param.miss({id, client_id, ticket_id, struts, used_at, create_at});
			return;
		}
		ctx.body = await ctx.service.ticketClient.findOne({id, client_id, ticket_id, struts, used_at, create_at});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {id, client_id, ticket_id, struts, used_at, create_at} = ctx.query;
		if (id == null || client_id == null || ticket_id == null || struts == null || used_at == null || create_at == null) {
			ctx.body = ctx.message.param.miss({id, client_id, ticket_id, struts, used_at, create_at});
			return;
		}
		ctx.body = await ctx.service.ticketClient.findAll({id, client_id, ticket_id, struts, used_at, create_at});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {client_id, ticket_id, struts, used_at} = ctx.request.body;
		if (client_id == null || ticket_id == null || struts == null || used_at == null) {
			ctx.body = ctx.message.param.miss({client_id, ticket_id, struts, used_at});
			return;
		}
		ctx.body = await ctx.service.ticketClient.add({client_id, ticket_id, struts, used_at});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, client_id, ticket_id, struts, used_at} = ctx.request.body;
		if (id == null || (client_id == null && ticket_id == null && struts == null && used_at == null)) {
			ctx.body = ctx.message.param.miss({id, client_id, ticket_id, struts, used_at});
			return;
		}
		ctx.body = await ctx.service.ticketClient.update({id, client_id, ticket_id, struts, used_at});
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
		ctx.body = await ctx.service.ticketClient.remove({ id });
	}

}
module.exports = TicketClientController;
