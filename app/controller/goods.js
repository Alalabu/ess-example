'use strict';

const Controller = require('egg').Controller;

class GoodsController extends Controller {

  /**
   * 新增商品
   */
  async create() {
    const { ctx } = this;
    const { area_id, store_id, channel_id, goods_pic, title, good_type, price, glimit, discount_price, priority, detail,
      meal_fee=0, hot, day_amount, stock_count, auto_fill_stock,
    } = ctx.request.body;
    if (!area_id || !store_id || !channel_id || !goods_pic || !title || !price || priority == null || 
      hot == null || day_amount == null || stock_count == null || auto_fill_stock == null
      ) {
      ctx.body = ctx.message.param.miss({ area_id, store_id, channel_id, goods_pic, title, good_type, price, 
        glimit, discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock });
      return;
    }
    ctx.body = await ctx.service.goods.create({ area_id, store_id, channel_id, goods_pic, title, good_type, price, 
      glimit, discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock });
  }

  /**
   * 修改商品
   */
  async update() {
    const { ctx } = this;
    const { area_id, goods_id, store_id, channel_id, goods_pic, title, good_type, price, glimit, discount_price, 
      priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock } = ctx.request.body;
    if (!area_id || !channel_id|| !goods_id || !store_id) {
      ctx.body = ctx.message.param.miss({ area_id, goods_id, store_id, channel_id, goods_pic, title, good_type, 
        price, glimit, discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock });
      return;
    }
    ctx.body = await ctx.service.goods.update({ area_id, goods_id, store_id, channel_id, goods_pic, title, 
      good_type, price, glimit, discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock });
  }

  /**
   * 删除地址
   */
  async delete() {
    const { ctx } = this;
    const { area_id, channel_id, goods_id, store_id } = ctx.request.body;
    if (!area_id || !channel_id || !goods_id || !store_id) {
      ctx.body = ctx.message.param.miss({ goods_id, store_id });
      return;
    }
    ctx.body = await ctx.service.goods.delete({ area_id, channel_id, goods_id, store_id });
  }

  /**
   * 查询地址单例
   */
  async find() {
    const { ctx } = this;
    const { goods_id } = ctx.query;
    if (!goods_id) {
      ctx.body = ctx.message.param.miss({ goods_id });
      return;
    }
    ctx.body = await ctx.service.goods.find({ goods_id });
  }

  /**
   * 新增地址
   */
  async findAll() {
    const { ctx } = this;
    const { store_id, area_id, channel_id, keyword, sort, pageIndex, hasStore } = ctx.query;
    ctx.body = await ctx.service.goods.findAll({ store_id, area_id, channel_id, keyword, sort, pageIndex, hasStore });
  }

  /**
   * 随机点餐
   */
  async randomAll() {
    const { ctx } = this;
    const { area_id } = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.goods.randomAll({ area_id });
  }
}

module.exports = GoodsController;
