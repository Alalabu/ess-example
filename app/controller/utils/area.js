'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

class AreaController extends Controller {

  async provinceAll() {
    const { ctx } = this;
    ctx.body = await ctx.service.utils.area.provinceAll();
  }

  async cityAll() {
    const { ctx } = this;
    const { provincecode } = ctx.query;
    if (!provincecode) {
      ctx.body = ctx.message.param.miss({ provincecode });
      return;
    }
    if (!Number(provincecode)) {
      ctx.body = ctx.message.param.invalid({ provincecode });
      return;
    }
    ctx.body = await ctx.service.utils.area.cityAll(provincecode);
  }

  async districtAll() {
    const { ctx } = this;
    const { citycode } = ctx.query;
    if (!citycode) {
      ctx.body = ctx.message.param.miss({ citycode });
      return;
    }
    if (!Number(citycode)) {
      ctx.body = ctx.message.param.invalid({ citycode });
      return;
    }
    ctx.body = await ctx.service.utils.area.districtAll(citycode);
  }
  /**
   * 地理位置逆解析
   */
  async geocoder() {
    const { ctx } = this;
    const { lat, lng } = ctx.query;
    if (!lat || !lng) {
      ctx.body = ctx.message.param.miss({ lat, lng });
      return;
    }
    if (!Number(lat) || !Number(lng)) {
      ctx.body = ctx.message.param.invalid({ lat, lng });
      return;
    }
    ctx.body = await ctx.service.utils.area.geocoder(lat, lng);
  }
}

module.exports = AreaController;
