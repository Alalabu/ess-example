'use strict';
/**
 * 模型 GoodsType 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const Controller = require('egg').Controller;
const _ = require('lodash');
const BaseService = require('./base/base');

class GoodsTypeService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.GoodsType;
	}

	// 用于查询父级类别下的子集集合
	async children({ parent_code }) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const { GoodsType } = sequelize;
		const where = { parent_code };
		const list = await GoodsType.findAll({ where, raw: true });
		return ctx.message.success(list);
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsType} = sequelize;
		let {id, code, name, parent_code, create_at} = option;
		const include = [];
		const where = _.omitBy(option, _.isNil);
		const info = await GoodsType.findOne({ where });
		return ctx.message.success(info);
	}

	// 用于查询所有模型数据的方法
	async findAll() {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsType} = sequelize;
		const typeList = await GoodsType.findAll({ raw: true });
		// console.log('原始数据: ', typeList)
		// 递归树结构
		const tmps = (function loopTypes(origin, list) {
			const surplusArr = [];
			if (origin == null && Array.isArray(list) && list.length > 0) {
				origin = [];
				list.forEach( t => {
					if (t.parent_code == null) {
						origin.push(t);
					} else {
						surplusArr.push(t);
					}
				});
				loopTypes(origin, surplusArr);
			} else if (Array.isArray(list) && list.length > 0) {
				for (let x = 0; x < origin.length; x++) {
					const o = origin[x];
					if (!o.children) {
						o.children = [];
					}
					const igIndexArr = [];
					for (let y = 0; y < list.length; y++) {
						const t = list[y];
						if(o.code == t.parent_code) {
							o.children.push(t);
							igIndexArr.push(y);
						}
					}
					igIndexArr.sort((a,b) => b-a).forEach(ia => list.splice(ia, 1));
				}
				//
				return origin.forEach(o => loopTypes(o.children, list));
			}
			return origin;
		})(null, typeList);
		return ctx.message.success(tmps);
	}

	// 新增模型的方法
	async add(goodsType) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {GoodsType} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let {code, name, parent_code} = goodsType
		try{
			let inputArgs = _.omitBy({code, name, parent_code}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			console.log('【add goodsType】 ： ', inputArgs);
			const goodsTypeInput = await GoodsType.create(inputArgs);
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
		const {GoodsType} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, code, name, parent_code} = goodsType;
		let msg = null, result = -1;
		try{
			result = await GoodsType.update( _.omitBy({code, name, parent_code}, _.isNil) , { where: { id } });
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
		const {GoodsType} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await GoodsType.destroy({where: {id}});
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
module.exports = GoodsTypeService;
