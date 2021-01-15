'use strict';

const Controller = require('egg').Controller;

class AnalyzeController extends Controller {

  /**
   * 订单时段的汇总分析
   */
  async timeSummary() {
    const { ctx } = this;
    const { area_id, store_id } = ctx.query;
    if (!area_id || !store_id) {
      ctx.body = ctx.message.param.miss({ area_id, store_id });
      return;
    }
    ctx.body = await ctx.service.analyze.timeSummary({area_id, store_id});
  }
}

module.exports = AnalyzeController;
