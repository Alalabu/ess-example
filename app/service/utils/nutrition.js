'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class NutritionService extends BaseService {
  /**
   * 营养摄入标准列表
   */
  async intakeAll({ id, has_elements = false }) {
    const { ctx } = this;
    if (typeof has_elements === 'string') {
      has_elements = Boolean(has_elements);
    }
    // 判断缓存
    const cacheKey = 'NutritionIntakeAll';
    const cacheData = await this.getCache(cacheKey);
    if (cacheData && !id && has_elements === true) {
      console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      return ctx.message.success(cacheData);
    }

    const { FoodNutritionStandard, FoodNutritionElement } = ctx.model;
    try {
      // 1. 查询配置
      const options = {};
      if (id) {
        options.where = { id };
      }
      if (has_elements === true) {
        options.include = [ { model: FoodNutritionElement } ];
      }
      const standard_result = await FoodNutritionStandard.findAll(options);
      // 数据缓存
      if (_.isArray(standard_result) && !id && has_elements === true) {
        const seconds = 60 * 60 * 24 * 1;
        await this.setCache(cacheKey, standard_result, seconds);
      }
      return ctx.message.success(standard_result);
    } catch (err) {
      return ctx.message.exception( err , '营养摄入标准列表');
    }
  }

  /**
   * 营养消耗类别表
   */
  async consumeAll() {
    const { ctx } = this;
    // 判断缓存
    const cacheKey = `NutritionConsumeAll`;
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      return ctx.message.success(cacheData);
    }

    const { FoodConsumeCategory } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const consumeList = await FoodConsumeCategory.findAll({ attributes:{exclude: ['create_at']}, raw: true });
      // 数据缓存
      if (_.isArray(consumeList) && consumeList?.length > 0) {
        const seconds = 60 * 60 * 24 * 1;
        await this.setCache(cacheKey, consumeList, seconds);
      }
      return ctx.message.success(consumeList);
    } catch (err) {
      return ctx.message.exception( err , '营养消耗类别表');
    }
  }

  /**
   * 营养计划推荐方案表
   */
  async recommendedAll() {
    const { ctx } = this;
    // 判断缓存
    const cacheKey = `NutritionRecommendedAll`;
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      return ctx.message.success(cacheData);
    }

    const { FoodConsumeRecom } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const consumeList = await FoodConsumeRecom.findAll({ attributes:{exclude: ['create_at']}, raw: true });
      // 数据缓存
      if (_.isArray(consumeList) && consumeList?.length > 0) {
        const seconds = 60 * 60 * 24 * 1;
        await this.setCache(cacheKey, consumeList, seconds);
      }
      return ctx.message.success(consumeList);
    } catch (err) {
      return ctx.message.exception( err , '营养计划推荐方案表');
    }
  }

}

module.exports = NutritionService;
