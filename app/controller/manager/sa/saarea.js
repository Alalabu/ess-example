'use strict';

const Controller = require('egg').Controller;
/**
 * Area 商圈管理
 */
class SaareaController extends Controller {
  /**
   * 
   */
  async create() {
    const { ctx } = this;
    const { merchant_id, city, city_code, province, province_code, name, title, longitude, latitude,
      receivable_way,
      parent_code, unify_delivery_fee, unify_meal_fee } = ctx.request.body;
    if (!merchant_id || !city || !city_code || !province || !province_code || !title || !receivable_way || !longitude || !latitude) {
      ctx.body = ctx.message.param.miss({merchant_id, city, city_code, province, province_code, title, longitude, latitude, parent_code, 
        receivable_way, unify_delivery_fee, unify_meal_fee});
      return;
    }
    ctx.body = await ctx.service.manager.sa.saarea.create({merchant_id, city, city_code, province, province_code, name, title, longitude, latitude, 
      receivable_way, parent_code, unify_delivery_fee, unify_meal_fee});
  }
  /**
   * 
   */
  async update() {
    const { ctx } = this;
    const { area_id, merchant_id, city, city_code, province, province_code, name, title, longitude, latitude, 
      receivable_way,
      parent_code, unify_delivery_fee, unify_meal_fee } = ctx.request.body;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({area_id});
      return;
    }
    ctx.body = await ctx.service.manager.sa.saarea.update({ area_id, merchant_id, city, city_code, province, province_code, name, title, longitude, latitude, 
      receivable_way, parent_code, unify_delivery_fee, unify_meal_fee });
  }
  /**
   * 
   */
  async delete() {
    const { ctx } = this;
    const { area_id } = ctx.request.body;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.manager.sa.saarea.delete({area_id});
  }
}

module.exports = SaareaController;
