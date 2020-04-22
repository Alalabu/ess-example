'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [index] \x1b[0m=> ', ctx.query);
    ctx.body = { msg: 'hi, egg index: ' + Object.keys(ctx.query).join(',') };
  }

  async query() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [query] \x1b[0m=> ', ctx.query);
    ctx.body = { msg: 'hi, egg query: ' + Object.keys(ctx.query).join(',') };
  }

  async checkToken() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [checkToken] \x1b[0m=> ', ctx.request.body);
    ctx.body = { msg: 'hi, egg checkToken: ' + Object.keys(ctx.request.body).join(','), currentUser: ctx.auth };
  }

  async findGirlsFondness() {
    const { ctx } = this;
    const { url } = ctx.request;
    const pageIndex = ctx.request.body.pageIndex || 1;
    console.log('[findGirlsFondness] ctx.request.body: ', ctx.request.body);
    console.log('[findGirlsFondness] header: ', ctx.request.header);
    console.log('[findGirlsFondness] url: ', url);
    const cacheKey = `${url}?pageIndex=${pageIndex}`;
    ctx.body = {
      err: 0, msg: 'success', data: await ctx.service.home.findAll({ cacheKey, pageIndex }),
    };
  }
}

module.exports = HomeController;
