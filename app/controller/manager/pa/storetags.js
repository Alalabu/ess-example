'use strict';

const Controller = require('egg').Controller;
/**
 * Area 商圈管理
 */
class StoretagsController extends Controller {
  /**
   * 
   */
  async create() {
    const { ctx } = this;
    const { area_id, tag_name, tag_code, priority } = ctx.request.body;
    if (!area_id || !tag_name || !tag_code || !priority) {
      ctx.body = ctx.message.param.miss({ area_id, tag_name, tag_code, priority });
      return;
    }
    ctx.body = await ctx.service.manager.pa.storetags.create({ area_id, tag_name, tag_code, priority });
  }
  /**
   * 
   */
  async update() {
    const { ctx } = this;
    const { area_id, tag_id, tag_name, tag_code, priority, struts } = ctx.request.body;
    if (!tag_id) {
      ctx.body = ctx.message.param.miss({area_id, tag_id, tag_name, tag_code, priority, struts});
      return;
    }
    ctx.body = await ctx.service.manager.pa.storetags.update({
      area_id, tag_id, tag_name, tag_code, priority, struts
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
    ctx.body = await ctx.service.manager.pa.storetags.delete({tag_id});
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
    ctx.body = await ctx.service.manager.pa.storetags.find({tag_id});
  }
}

module.exports = StoretagsController;
