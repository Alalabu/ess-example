'use strict';
/**
 * 模型 StoreDining 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
const Controller = require('egg').Controller;

class StoreDiningController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id, name} = ctx.query;
		if (id == null && name == null) {
			ctx.body = ctx.message.param.miss({id, name});
			return;
		}
		ctx.body = await ctx.service.storeDining.findOne({id, name});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {area_id} = ctx.query;
		if (area_id == null) {
			ctx.body = ctx.message.param.miss({area_id});
			return;
		}
		ctx.body = await ctx.service.storeDining.findAll({area_id});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {area_id, name, priority} = ctx.request.body;
		if (area_id == null || name == null) {
			ctx.body = ctx.message.param.miss({area_id, name, priority});
			return;
		}
		ctx.body = await ctx.service.storeDining.add({area_id, name, priority});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, area_id, name, priority} = ctx.request.body;
		if (id == null || (area_id == null && name == null && priority == null)) {
			ctx.body = ctx.message.param.miss({id, area_id, name, priority});
			return;
		}
		ctx.body = await ctx.service.storeDining.update({id, area_id, name, priority});
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
		ctx.body = await ctx.service.storeDining.remove({ id });
	}

}
module.exports = StoreDiningController;
