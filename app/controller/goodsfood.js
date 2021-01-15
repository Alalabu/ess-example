'use strict';

const Controller = require('egg').Controller;

class GoodsfoodController extends Controller {

  /**
   * 建立商品食材关联
   * 建立关联时,服务器端将汇总当前商品所关联的食材的总营养数值
   */
  async create() {
    const { ctx } = this;
    const { store_id, goods_id, foods } = ctx.request.body;
    if (!store_id || !goods_id || !foods || !Array.isArray(foods)) {
      ctx.body = ctx.message.param.miss({ store_id, goods_id, foods });
      return;
    }
    ctx.body = await ctx.service.goodsfood.create({ store_id, goods_id, foods });
  }

  /**
   * 移除商品食材关联
   * 移除关联时,服务器端将汇总(新的)当前商品所关联的食材的总营养数值
   */
  async remove() {
    const { ctx } = this;
    const { store_id, goods_id, foods } = ctx.request.body;
    if (!store_id || !goods_id || !foods || !Array.isArray(foods)) {
      ctx.body = ctx.message.param.miss({ store_id, goods_id, foods });
      return;
    }
    ctx.body = await ctx.service.goodsfood.remove({ store_id, goods_id, foods });
  }

  /**
   * 查询商品食材关联列表
   * 返回商品(及营养数据)，和所关联的所有食材数据
   */
  async findAll() {
    const { ctx } = this;
    const { goods_id } = ctx.query;
    if (!goods_id) {
      ctx.body = ctx.message.param.miss({ goods_id });
      return;
    }
    ctx.body = await ctx.service.goodsfood.findAll({ goods_id });
  }
}

module.exports = GoodsfoodController;
