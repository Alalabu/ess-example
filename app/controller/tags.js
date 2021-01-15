'use strict';

const Controller = require('egg').Controller;

class StoreController extends Controller {

  /**
   * 查询商户类别 (列表)
   */
  async tagsFindAll() {
    const { ctx } = this;
    const { area_id, hasStore } = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.tags.tagsFindAll({area_id, hasStore});
  }

  /**
   * 查询商户类别 (列表)
   */
  async orderTagsFindAll() {
    const { ctx } = this;
    const { storetag_id } = ctx.query;
    if (!storetag_id) {
      ctx.body = ctx.message.param.miss({ storetag_id });
      return;
    }
    ctx.body = await ctx.service.tags.orderTagsFindAll({storetag_id});
  }
}

module.exports = StoreController;
