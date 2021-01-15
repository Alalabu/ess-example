'use strict';

const Controller = require('egg').Controller;

class FollowController extends Controller {

  /**
   * 新增关注
   */
  async create() {
    const { ctx } = this;
    const { client_id, store_id } = ctx.request.body;
    if (!client_id || !store_id) {
      ctx.body = ctx.message.param.miss({ client_id, store_id });
      return;
    }
    ctx.body = await ctx.service.follow.create({ client_id, store_id });
  }

  /**
   * 取消关注
   */
  async cancel() {
    const { ctx } = this;
    const { client_id, store_id } = ctx.request.body;
    if (!client_id || !store_id) {
      ctx.body = ctx.message.param.miss({ client_id, store_id });
      return;
    }
    ctx.body = await ctx.service.follow.cancel({ client_id, store_id });
  }

  /**
   * 查询关注列表
   */
  async findAll() {
    const { ctx } = this;
    const { client_id, hasStore, pageIndex } = ctx.query;
    if (!client_id) {
      ctx.body = ctx.message.param.miss({ client_id, hasStore, pageIndex });
      return;
    }
    ctx.body = await ctx.service.follow.findAll({ client_id, hasStore, pageIndex });
  }
}

module.exports = FollowController;
