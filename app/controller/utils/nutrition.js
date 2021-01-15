'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

/**
 * 营养相关
 */
class NutritionController extends Controller {
  /**
   * 营养摄入标准列表
   */
  async intakeAll() {
    const { ctx } = this;
    const { id, has_elements } = ctx.query;
    ctx.body = await ctx.service.utils.nutrition.intakeAll({ id, has_elements });
  }

  /**
   * 营养消耗类别表
   */
  async consumeAll() {
    const { ctx } = this;
    // const { provincecode } = ctx.query;
    ctx.body = await ctx.service.utils.nutrition.consumeAll();
  }

  /**
   * 营养计划推荐方案表
   */
  async recommendedAll() {
    const { ctx } = this;
    // const { provincecode } = ctx.query;
    ctx.body = await ctx.service.utils.nutrition.recommendedAll();
  }
}

module.exports = NutritionController;
