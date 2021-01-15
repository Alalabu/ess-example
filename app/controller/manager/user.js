'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async getError() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [getError] \x1b[0m=> ', ctx.query);
    ctx.returnError({ msg: '/getError test Exception!', err: 1010 });
    // ctx.body = ctx.returnWarn({ msg: '/login test Exception!', err: 1010, attach: ctx.request.body });
    // ctx.body = 'hi, egg login: ' + Object.keys(ctx.request.body).join(',');
    // ctx.body = { msg: 'hi, egg login: ' + Object.keys(ctx.request.body).join(',') };
  }

  async login() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [login] \x1b[0m=> ', ctx.request.body);
    ctx.returnError({ msg: '/login test Exception!', err: 1010 });
    // ctx.body = ctx.returnWarn({ msg: '/login test Exception!', err: 1010, attach: ctx.request.body });
    // ctx.body = 'hi, egg login: ' + Object.keys(ctx.request.body).join(',');
    // ctx.body = { msg: 'hi, egg login: ' + Object.keys(ctx.request.body).join(',') };
  }

  async register() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [register] \x1b[0m=> ', ctx.request.body);
    ctx.body = { msg: 'hi, egg register: ' + Object.keys(ctx.request.body).join(',') };
  }

  async newOrder() {
    const { ctx } = this;
    const { username, price } = ctx.request.body;
    ctx.body = await ctx.service.manager.user.newOrder(username, price);
  }
}

module.exports = UserController;
