'use strict';

const Controller = require('egg').Controller;
/**
 * Banner 管理
 */
class BannerController extends Controller {

  async create() {
    const { ctx } = this;
    const { picurl, priority, area_id } = ctx.request.body;
    if (!picurl || !priority || !area_id) {
      ctx.body = ctx.message.param.miss({ picurl, priority, area_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.banner.create({picurl, priority, area_id});
  }

  async delete() {
    const { ctx } = this;
    const { banner_id } = ctx.request.body;
    if (!banner_id) {
      ctx.body = ctx.message.param.miss({ banner_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.banner.delete(banner_id);
  }
}

module.exports = BannerController;
