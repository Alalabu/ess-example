'use strict';
/**
 * 模型 GoodsType 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
const Controller = require('egg').Controller;

class GoodsSpecController extends Controller {
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
		ctx.body = await ctx.service.goodsSpec.findOne({id});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {goods_id} = ctx.query;
		if (goods_id == null) {
			ctx.body = ctx.message.param.miss({goods_id});
			return;
		}
		ctx.body = await ctx.service.goodsSpec.findAll({goods_id});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {goods_id, title} = ctx.request.body;
		if (goods_id == null || title == null) {
			ctx.body = ctx.message.param.miss({goods_id, title});
			return;
		}
		ctx.body = await ctx.service.goodsSpec.add({goods_id, title});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, title} = ctx.request.body;
		if (id == null || (title == null)) {
			ctx.body = ctx.message.param.miss({id, title});
			return;
		}
		ctx.body = await ctx.service.goodsSpec.update({id, title});
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
		ctx.body = await ctx.service.goodsSpec.remove({ id });
	}

}
module.exports = GoodsSpecController;
