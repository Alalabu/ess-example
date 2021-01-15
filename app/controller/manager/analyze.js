'use strict';

const Controller = require('egg').Controller;

class AnalyzeController extends Controller {

  /**
   * 查询商圈下订单额及数量数据
   */
  async areaOrderStatistics() {
    const { ctx } = this;
    const { area_id, orderstruts, refundstruts, begin_date, end_date, has_stores } = ctx.query;
    if (!area_id || !begin_date || !end_date) {
      ctx.body = ctx.message.param.miss({ area_id, orderstruts, refundstruts, begin_date, end_date, has_stores });
      return;
    }
    ctx.body = await ctx.service.manager.analyze.areaOrderStatistics({area_id, orderstruts, refundstruts, 
      begin_date, end_date, has_stores});
  }
}

module.exports = AnalyzeController;
