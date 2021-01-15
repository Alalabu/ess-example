'use strict';
/**
 * 模型 GoodsType 的 Controller
*/

// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
const Controller = require('egg').Controller;

class GoodsTypeController extends Controller {
	constructor(ctx) {
		super(ctx);
	}

	// 用于查询单个模型数据的方法
	async findOne() {
		// 获取参数
		const {ctx} = this;
		const {id, code, name, parent_code, create_at} = ctx.query;
		if (id == null || code == null || name == null || parent_code == null || create_at == null) {
			ctx.body = ctx.message.param.miss({id, code, name, parent_code, create_at});
			return;
		}
		ctx.body = await ctx.service.goodsType.findOne({id, code, name, parent_code, create_at});
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		// 获取参数
		const {ctx} = this;
		const {id, code, name, parent_code, create_at} = ctx.query;
		// if (id == null || code == null || name == null || parent_code == null || create_at == null) {
		// 	ctx.body = ctx.message.param.miss({id, code, name, parent_code, create_at});
		// 	return;
		// }
		ctx.body = await ctx.service.goodsType.findAll({id, code, name, parent_code, create_at});
	}

	// 用于查询所有模型数据的方法
	async children() {
		// 获取参数
		const {ctx} = this;
		const {parent_code} = ctx.query;
		// if (id == null || code == null || name == null || parent_code == null || create_at == null) {
		// 	ctx.body = ctx.message.param.miss({id, code, name, parent_code, create_at});
		// 	return;
		// }
		ctx.body = await ctx.service.goodsType.children({parent_code});
	}

	// 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {code, name, parent_code} = ctx.request.body;
		if (code == null || name == null || parent_code == null) {
			ctx.body = ctx.message.param.miss({code, name, parent_code});
			return;
		}
		ctx.body = await ctx.service.goodsType.add({code, name, parent_code});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, code, name, parent_code} = ctx.request.body;
		if (id == null || (code == null && name == null && parent_code == null)) {
			ctx.body = ctx.message.param.miss({id, code, name, parent_code});
			return;
		}
		ctx.body = await ctx.service.goodsType.update({id, code, name, parent_code});
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
		ctx.body = await ctx.service.goodsType.remove({ id });
	}

}
module.exports = GoodsTypeController;
