'use strict';

const Controller = require('egg').Controller;
/**
 * Area 商圈管理
 */
class GmController extends Controller {
  /**
   * 
   */
  async create() {
    const { ctx } = this;
    const { username, gendar, phonenum, areas, email } = ctx.request.body;
    if (!username || !gendar || !phonenum || !areas) {
      ctx.body = ctx.message.param.miss({username, gendar, phonenum, areas, email});
      return;
    }
    ctx.body = await ctx.service.manager.sa.gm.create({username, gendar, phonenum, areas, email});
  }
  /**
   * 
   */
  async update() {
    const { ctx } = this;
    const { manager_id, username, gendar, phonenum, new_areas, del_areas, email } = ctx.request.body;
    if (!manager_id) {
      ctx.body = ctx.message.param.miss({manager_id, username, gendar, phonenum, new_areas, del_areas, email});
      return;
    }
    ctx.body = await ctx.service.manager.sa.gm.update({ manager_id, username, gendar, phonenum, new_areas, del_areas, email });
  }
  /**
   * 
   */
  async delete() {
    const { ctx } = this;
    const { manager_id } = ctx.request.body;
    if (!manager_id) {
      ctx.body = ctx.message.param.miss({ manager_id });
      return;
    }
    ctx.body = await ctx.service.manager.sa.gm.delete({manager_id});
  }

  /**
   * 
   */
  async changeAuth() {
    const { ctx } = this;
    const { origin_manager_id, new_manager_id } = ctx.request.body;
    if (!origin_manager_id || !new_manager_id) {
      ctx.body = ctx.message.param.miss({ origin_manager_id, new_manager_id });
      return;
    }
    ctx.body = await ctx.service.manager.sa.gm.changeAuth({origin_manager_id, new_manager_id});
  }

  /**
   * 
   */
  async find() {
    const { ctx } = this;
    const { manager_id } = ctx.query;
    if (!manager_id) {
      ctx.body = ctx.message.param.miss({ manager_id });
      return;
    }
    ctx.body = await ctx.service.manager.sa.gm.find({manager_id});
  }

  /**
   * 
   */
  async findAll() {
    const { ctx } = this;
    const { struts } = ctx.query;
    ctx.body = await ctx.service.manager.sa.gm.findAll({ struts });
  }
}

module.exports = GmController;
