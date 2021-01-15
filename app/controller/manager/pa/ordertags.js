'use strict';

const Controller = require('egg').Controller;
/**
 * 订单标签 商圈管理
 */
class OrdertagsController extends Controller {
  /**
   * 
   */
  async create() {
    const { ctx } = this;
    const { storetag_id, tag_name, priority } = ctx.request.body;
    if (!storetag_id || !tag_name || !priority) {
      ctx.body = ctx.message.param.miss({ storetag_id, tag_name, priority });
      return;
    }
    ctx.body = await ctx.service.manager.pa.ordertags.create({ storetag_id, tag_name, priority });
  }
  /**
   * 
   */
  async update() {
    const { ctx } = this;
    const { tag_id, storetag_id, tag_name, priority } = ctx.request.body;
    if (!tag_id) {
      ctx.body = ctx.message.param.miss({tag_id, storetag_id, tag_name, priority});
      return;
    }
    ctx.body = await ctx.service.manager.pa.ordertags.update({
      tag_id, storetag_id, tag_name, priority
    });
  }
  /**
   * 
   */
  async delete() {
    const { ctx } = this;
    const { tag_id } = ctx.request.body;
    if (!tag_id) {
      ctx.body = ctx.message.param.miss({ tag_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.ordertags.delete({tag_id});
  }
  /**
   * 
   */
  async find() {
    const { ctx } = this;
    const { tag_id } = ctx.query;
    if (!tag_id) {
      ctx.body = ctx.message.param.miss({ tag_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.ordertags.find({tag_id});
  }
}

module.exports = OrdertagsController;
