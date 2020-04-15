'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [login] \x1b[0m=> ', ctx.request.body);
    ctx.body = 'hi, egg login: ' + Object.keys(ctx.request.body).join(',');
    // ctx.body = { msg: 'hi, egg login: ' + Object.keys(ctx.request.body).join(',') };
  }

  async register() {
    const { ctx } = this;
    console.log('\x1b[39m[Seneca API] [register] \x1b[0m=> ', ctx.request.body);
    ctx.body = { msg: 'hi, egg register: ' + Object.keys(ctx.request.body).join(',') };
  }
}

module.exports = UserController;
