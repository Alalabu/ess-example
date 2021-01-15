'use strict';

const Controller = require('egg').Controller;

class BannerController extends Controller {

  /**
   * 查询Banners
   */
  async findAll() {
    const { ctx } = this;
    const { area_id } = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.banner.findAll({area_id});
  }
}

module.exports = BannerController;
