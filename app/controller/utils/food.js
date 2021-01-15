'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

/**
 * 食材相关
 */
class FoodController extends Controller {

  /**
   * 创建食材
   */
  async create() {
    const { ctx } = this;
    const { name, alias, detail_url, rl, zf, dbz, shhf, ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, 
      dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = ctx.request.body;
    if (!name || !detail_url || rl == null || zf == null || dbz == null || shhf == null || ssxw == null || wssa == null || las == null || 
      su == null || ys == null || wsfc == null || wsse == null || shc == null || lb == null || dgc == null || gai == null || 
      mei == null || tei == null || meng == null || xin == null || tong == null || jia == null || ling == null || 
      la == null || xi == null) {
      ctx.body = ctx.message.param.miss(ctx.request.body);
      return;
    }
    ctx.body = await ctx.service.utils.food.create(ctx.request.body);
  }

  /**
   * 修改食材
   */
  async update() {
    const { ctx } = this;
    const { food_id, name, alias, detail_url, rl, zf, dbz, shhf, ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, 
      dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = ctx.request.body;
    if (!food_id) {
      ctx.body = ctx.message.param.miss(ctx.request.body);
      return;
    }
    ctx.body = await ctx.service.utils.food.update(ctx.request.body);
  }

  /**
   * 删除食材
   */
  async remove() {
    const { ctx } = this;
    const { food_id } = ctx.request.body;
    if (!food_id) {
      ctx.body = ctx.message.param.miss({ food_id });
      return;
    }
    ctx.body = await ctx.service.utils.food.remove({ food_id });
  }

  /**
   * 查询食材数据(单例)
   */
  async findOne() {
    const { ctx } = this;
    const { food_id } = ctx.query;
    if (!food_id) {
      ctx.body = ctx.message.param.miss({ food_id });
      return;
    }
    ctx.body = await ctx.service.utils.food.findOne({ food_id });
  }

  /**
   * 查询食材数据(列表)
   */
  async findAll() {
    const { ctx } = this;
    const { name, type, sort, limit, pageIndex } = ctx.query;
    ctx.body = await ctx.service.utils.food.findAll({name, type, sort, limit, pageIndex});
  }

  /**
   * 查询食材类别(列表)
   */
  async typeAll() {
    const { ctx } = this;
    // const { name, type, sort, limit, pageIndex } = ctx.query;
    ctx.body = await ctx.service.utils.food.typeAll();
  }
}

module.exports = FoodController;
