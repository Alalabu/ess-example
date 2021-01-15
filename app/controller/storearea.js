'use strict';

const Controller = require('egg').Controller;

class StoreareaController extends Controller {

  async find() {
    const { ctx } = this;
    const { area_id, longitude, latitude, hasStore } = ctx.query;
    if (!area_id && (!longitude || !latitude)) { // area_id 及 坐标 二者需存在其一
      ctx.body = ctx.message.param.miss({ area_id, longitude, latitude, hasStore });
      return;
    }
    ctx.body = await ctx.service.storearea.find({ area_id, longitude, latitude, hasStore });
  }

  async findAll() {
    const { ctx } = this;
    const { city, city_code, province, province_code, has_store_count } = ctx.query;
    // if (!city_code && ) {
    //   ctx.body = ctx.message.param.miss({ city_code, has_store_count });
    //   return;
    // }
    ctx.body = await ctx.service.storearea.findAll({ city, city_code, province, province_code, has_store_count });
  }

  async findProvince() {
    const { ctx } = this;
    const { hasStoreArea } = ctx.query;
    // if (!city_code && ) {
    //   ctx.body = ctx.message.param.miss({ city_code, has_store_count });
    //   return;
    // }
    ctx.body = await ctx.service.storearea.findProvince({hasStoreArea});
  }
}

module.exports = StoreareaController;
