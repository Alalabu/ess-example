'use strict';
/**
 * 模型 OrderComment 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
const Controller = require('egg').Controller;

class OrderCommentController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id, out_trade_no} = ctx.query;
		if (id == null && out_trade_no == null) {
			ctx.body = ctx.message.param.miss({id, out_trade_no});
			return;
		}
		ctx.body = await ctx.service.order.orderComment.findOne({id, out_trade_no});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {store_id, client_id, status, pageIndex, limit} = ctx.query;
		if ((store_id == null && client_id == null && status == null) || pageIndex == null || limit == null) {
			ctx.body = ctx.message.param.miss({store_id, client_id, status, pageIndex, limit});
			return;
		}
		ctx.body = await ctx.service.order.orderComment.findAll({store_id, client_id, status, pageIndex, limit});
	}

	/**
	 * 查询评论数量
	 */
	async count() {
		// 获取参数
		const {ctx} = this;
		const {store_id, client_id} = ctx.query;
		if (store_id == null && client_id == null) {
			ctx.body = ctx.message.param.miss({store_id, client_id});
			return;
		}
		ctx.body = await ctx.service.order.orderComment.count({store_id, client_id});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {store_id, client_id, out_trade_no, reply_id, pic_url, score, content, is_anonymity, status} = ctx.request.body;
		if (store_id == null || client_id == null || out_trade_no == null || score == null || content == null || is_anonymity == null) {
			ctx.body = ctx.message.param.miss({store_id, client_id, out_trade_no, reply_id, pic_url, score, content, is_anonymity, status});
			return;
		}
		ctx.body = await ctx.service.order.orderComment.add({store_id, client_id, out_trade_no, reply_id, pic_url, score, content, is_anonymity, status});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, pic_url, score, content, is_anonymity, status} = ctx.request.body;
		if (id == null || (pic_url == null && score == null && content == null && is_anonymity == null && status == null)) {
			ctx.body = ctx.message.param.miss({id, pic_url, score, content, is_anonymity, status});
			return;
		}
		ctx.body = await ctx.service.order.orderComment.update({id, pic_url, score, content, is_anonymity, status});
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
		ctx.body = await ctx.service.order.orderComment.remove({ id });
	}

}
module.exports = OrderCommentController;
