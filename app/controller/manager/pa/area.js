'use strict';

const Controller = require('egg').Controller;
/**
 * Area 商圈管理
 */
class AreaController extends Controller {
  /**
   * 查询管理的商圈
   */
  async findAll() {
    const { ctx } = this;
    ctx.body = await ctx.service.manager.pa.area.findAll();
  }
  /**
   * 查询桌签物料素材
   */
  async tablesign() {
    const { ctx } = this;
    const { area_id } = ctx.request.body;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.area.tablesign(area_id);
  }
}

module.exports = AreaController;
