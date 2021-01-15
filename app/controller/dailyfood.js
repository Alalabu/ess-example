'use strict';

const Controller = require('egg').Controller;

class DailyfoodController extends Controller {

  /**
   * 修改食物清单中摄入量
   */
  async update() {
    const { ctx } = this;
    const { dailyfood_id, use_percent } = ctx.request.body;
    if (!dailyfood_id || !use_percent) {
      ctx.body = ctx.message.param.miss({ dailyfood_id, use_percent });
      return;
    }
    ctx.body = await ctx.service.dailyfood.update({ dailyfood_id, use_percent });
  }

  /**
   * 删除食物清单中的食物
   */
  async delete() {
    const { ctx } = this;
    const { dailyfood_id } = ctx.request.body;
    if (!dailyfood_id) {
      ctx.body = ctx.message.param.miss({ dailyfood_id });
      return;
    }
    ctx.body = await ctx.service.dailyfood.delete({ dailyfood_id });
  }

  /**
   * 查询摄入食物清单(列表)
   */
  async findAll() {
    const { ctx } = this;
    const { client_id, begin_date, end_date, pageIndex, limit } = ctx.query;
    if (!client_id || !begin_date || !end_date ) {
      ctx.body = ctx.message.param.miss({ client_id, begin_date, end_date, pageIndex, limit });
      return;
    }
    ctx.body = await ctx.service.dailyfood.findAll({client_id, begin_date, end_date, pageIndex, limit});
  }

  /**
   * 查询每日摄入营养数据
   */
  async analyze() {
    const { ctx } = this;
    const { client_id, begin_date, end_date } = ctx.query;
    if (!client_id || !begin_date || !end_date) {
      ctx.body = ctx.message.param.miss({ client_id, begin_date, end_date });
      return;
    }
    ctx.body = await ctx.service.dailyfood.analyze({ client_id, begin_date, end_date });
  }

  /**
   * 查询日期食物摄入统计 (月度)
   */
  async dateStat() {
    const { ctx } = this;
    const { client_id, begin_date, end_date } = ctx.query;
    if (!client_id || !begin_date || !end_date) {
      ctx.body = ctx.message.param.miss({ client_id, begin_date, end_date });
      return;
    }
    ctx.body = await ctx.service.dailyfood.dateStat({ client_id, begin_date, end_date });
  }
}

module.exports = DailyfoodController;
