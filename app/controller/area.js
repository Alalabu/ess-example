'use strict';

const Controller = require('egg').Controller;

class AreaController extends Controller {

  async provinceAll() {
    const { ctx } = this;
    ctx.body = await ctx.service.area.provinceAll();
  }

  async cityAll() {
    const { ctx } = this;
    const { provincecode } = ctx.query;
    ctx.body = await ctx.service.area.cityAll(provincecode);
  }

  async districtAll() {
    const { ctx } = this;
    const { citycode } = ctx.query;
    ctx.body = await ctx.service.area.districtAll(citycode);
  }
}

module.exports = AreaController;
