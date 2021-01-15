'use strict';
/**
 * 模型 StoreDining 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const Controller = require('egg').Controller;
const _ = require('lodash');
const BaseService = require('./base/base');

class StoreDiningService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.StoreDining;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreDining} = sequelize;
		let {id, name} = option;
		const include = [];
		const where = _.omitBy(option, _.isNil);
		const info = await StoreDining.findOne({ where });
		return ctx.message.success(info);
	}

	// 用于查询所有模型数据的方法
	async findAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreDining} = sequelize;
		let {area_id} = option;
		const where = _.omitBy(option, _.isNil);
		const orderby = [['priority', 'DESC']];
		// const include = [];
		const list = await StoreDining.findAll({where, order: orderby });
		return ctx.message.success(list);
	}

	// 新增模型的方法
	async add(storeDining) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreDining} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {area_id, name, priority} = storeDining
		try{
			let inputArgs = _.omitBy({area_id, name, priority}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			console.log('【add storeDining】 ： ', inputArgs);
			const storeDiningInput = await StoreDining.create(inputArgs);
			// await transaction.commit();
			return ctx.message.success(storeDiningInput);
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 修改模型的方法
	async update(storeDining) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreDining} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, area_id, name, priority} = storeDining;
		let msg = null, result = -1;
		try{
			result = await StoreDining.update( _.omitBy({area_id, name, priority}, _.isNil) , { where: { id } });
			// await transaction.commit();
			const affected_rows_count = result[0];
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

	// 删除模型的方法
	async remove({id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {StoreDining} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await StoreDining.destroy({where: {id}});
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
module.exports = StoreDiningService;
