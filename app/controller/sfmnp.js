'use strict';

const Controller = require('egg').Controller;

class SfmnpController extends Controller {

  /**
   * 新增营养计划
   */
  async create() {
    const { ctx } = this;
    const { client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = ctx.request.body;
    if (!client_id || !category_id || !title || !age || !gender || !stature || !weight || !is_default || rl == null || zf == null || 
      recom_id == null || dbz == null || shhf == null || ssxw == null || wssa == null || las == null || 
      su == null || ys == null || wsfc == null || wsse == null || shc == null || lb == null || dgc == null || gai == null || 
      mei == null || tei == null || meng == null || xin == null || tong == null || jia == null || ling == null || 
      la == null || xi == null) {
      ctx.body = ctx.message.param.miss({ client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
        ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi });
      return;
    }
    ctx.body = await ctx.service.sfmnp.create({ client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi });
  }

  /**
   * 修改营养计划
   */
  async update() {
    const { ctx } = this;
    const { sfmnp_id, client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = ctx.request.body;
    if (!sfmnp_id || !client_id ) {
      ctx.body = ctx.message.param.miss({ sfmnp_id, client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
        ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi });
      return;
    }
    ctx.body = await ctx.service.sfmnp.update({ sfmnp_id, client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi });
  }

  /**
   * 删除营养计划
   */
  async delete() {
    const { ctx } = this;
    const { sfmnp_id, client_id } = ctx.request.body;
    if (!sfmnp_id || !client_id) {
      ctx.body = ctx.message.param.miss({ sfmnp_id, client_id });
      return;
    }
    ctx.body = await ctx.service.sfmnp.delete({ sfmnp_id, client_id });
  }

  /**
   * 查询默认营养计划(单例)
   */
  async defaultOne() {
    const { ctx } = this;
    const { client_id } = ctx.query;
    if (!client_id) {
      ctx.body = ctx.message.param.miss({ client_id });
      return;
    }
    ctx.body = await ctx.service.sfmnp.defaultOne({ client_id });
  }

  /**
   * 查询营养计划(单例)
   */
  async find() {
    const { ctx } = this;
    const { sfmnp_id } = ctx.query;
    if (!sfmnp_id) {
      ctx.body = ctx.message.param.miss({ sfmnp_id });
      return;
    }
    ctx.body = await ctx.service.sfmnp.find({ sfmnp_id });
  }

  /**
   * 查询营养计划(列表)
   */
  async findAll() {
    const { ctx } = this;
    const { client_id } = ctx.query;
    if (!client_id) {
      ctx.body = ctx.message.param.miss({ client_id });
      return;
    }
    ctx.body = await ctx.service.sfmnp.findAll({ client_id });
  }
}

module.exports = SfmnpController;
