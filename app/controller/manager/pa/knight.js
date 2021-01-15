'use strict';

const Controller = require('egg').Controller;
/**
 * Knight 骑手部分管理
 */
class KngihtController extends Controller {

  async create() {
    const { ctx } = this;
    const { username, gender, phonenum, area_id } = ctx.request.body;
    if (!username || !gender || !phonenum || !area_id) {
      ctx.body = ctx.message.param.miss({ username, gender, phonenum, area_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.knight.create({username, gender, phonenum, area_id});
  }

  async update() {
    const { ctx } = this;
    const { knight_id, struts, logourl, pid, username, gender, phonenum, area_id } = ctx.request.body;
    if (!knight_id) {
      ctx.body = ctx.message.param.miss({ knight_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.knight.update({ knight_id, struts, logourl, pid, username, gender, phonenum, area_id });
  }

  async remove() {
    const { ctx } = this;
    const { knight_id } = ctx.request.body;
    if (!knight_id) {
      ctx.body = ctx.message.param.miss({ knight_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.knight.remove(knight_id);
  }
}

module.exports = KngihtController;
