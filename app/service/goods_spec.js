'use strict';
/**
 * 模型 GoodsSpec 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const _ = require('lodash');
const BaseService = require('./base/base');

class GoodsSpecService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.GoodsSpec;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsSpec} = sequelize;
		let {id} = option;
		// const include = [];
		const where = {id};
		const info = await GoodsSpec.findOne({ where });
		return ctx.message.success(info);
	}

	// 用于查询所有模型数据的方法
	async findAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsSpec} = sequelize;
		let {goods_id} = option;
		const list = await GoodsSpec.findAll({ where: {goods_id}, raw: true });
		return ctx.message.success(list);
	}

	// 新增模型的方法
	async add(goodsType) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsSpec} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {goods_id, title} = goodsType
		try{
			let inputArgs = {goods_id, title};
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			// console.log('【add goodsType】 ： ', inputArgs);
			const goodsTypeInput = await GoodsSpec.create(inputArgs);
			// await transaction.commit();
			return ctx.message.success(goodsTypeInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(goodsType) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsSpec} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, title} = goodsType;
		let msg = null, result = -1;
		try{
			result = await GoodsSpec.update({title}, { where: { id } });
			// await transaction.commit();
			const affected_rows_count = result[0];
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect(goodsType);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}

	// 删除模型的方法
	async remove({id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsSpec} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await GoodsSpec.destroy({where: {id}});
			const affected_rows_count = result;
			// await transaction.commit();
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}

}
module.exports = GoodsSpecService;
