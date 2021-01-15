'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 食材相关的业务
 * @param {object} ctx Context对象
 */
class FoodService extends BaseService {
  /**
   * 新增食材
   */
  async create(options) {
    const { ctx } = this;
    const { name, alias, detail_url, rl, zf, dbz, shhf, ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, 
      dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = options;

    const { Food } = ctx.model;
    try {
      // 1. 创建新的食材数据
      const food = await Food.create(options);
      return ctx.message.success(food);
    } catch (err) {
      return ctx.message.exception( err , '新增食材');
    }
  }

  /**
   * 修改食材
   */
  async update(options) {
    const { ctx } = this;
    const { food_id, name, alias, detail_url, rl, zf, dbz, shhf, ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, 
      dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = options;

    const { Food } = ctx.model;
    try {
      // 1. 修改食材数据
      const saveData = _.omitBy({name, alias, detail_url, rl, zf, dbz, shhf, ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, 
        dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi}, _.isNil);
      const result = await Food.update(saveData, { where: {id: food_id} });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception( err , '修改食材');
    }
  }

  /**
   * 删除食材
   */
  async remove(options) {
    const { ctx } = this;
    const { food_id } = options;

    const { Food } = ctx.model;
    try {
      // 1. 删除食材数据
      const result = await Food.destroy({ where: { id: food_id }});
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception( err , '删除食材');
    }
  }

  /**
   * 查询食材数据(单例)
   */
  async findOne(options) {
    const { ctx } = this;
    const { food_id } = options;

    const { Food } = ctx.model;
    try {
      // 1. 查询食材数据
      const result = await Food.findOne({ where: { id: food_id }, raw: true });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception( err , '查询食材(单例)');
    }
  }

  /**
   * 查询食材数据(单例)
   */
  async findAll({name, type, sort, limit = 20, pageIndex = 1}) {
    const { ctx } = this;

    const { Food } = ctx.model;
    // 查询条件
    const options = { where: {}, raw: true };
    // 行数限定
    limit = Number(limit);
    if (limit > 100) {
      limit = 100;
    }
    options.limit = limit;
    // 通过页码计算偏移量
    options.offset = (pageIndex - 1) * limit;
    // 排序限定
    options.order = [];
    if (sort) {
      options.order.push([sort, 'DESC']);
    }
    // 条件限定
    if (type) options.where.type = type;
    if (name) options.where.name = {[ctx.Op.like]: `%${name}%`};

    try {
      // 1. 查询食材数据
      const result = await Food.findAll(options);
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception( err , '查询食材(列表)');
    }
  }

  /**
   * 查询食材类别(列表)
   */
  async typeAll() {
    const { ctx } = this;
    // 判断缓存
    const cacheKey = 'FoodTypesList';
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      return ctx.message.success(cacheData);
    }

    const sequelize = ctx.model;
    const { Food } = sequelize;
    // 查询条件
    const options = {
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('type')),'total']],
      group: 'type', raw: true 
    };

    try {
      // 1. 查询食材数据
      const result = await Food.findAll(options);
      // 数据缓存
      const seconds = 60 * 60 * 24 * 1;
      await this.setCache(cacheKey, result, seconds);
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception( err , '查询食材类别(列表)');
    }
  }

}

module.exports = FoodService;
