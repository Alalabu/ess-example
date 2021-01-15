'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async saveInfo() {
    const { ctx } = this;
    const { client_id, username, phonenum, logourl, gender, email } = ctx.request.body;
    if (!username && !phonenum && !logourl && !gender && !email) {
      ctx.body = ctx.message.param.miss({ client_id, username, phonenum, logourl, gender, email });
      return;
    }
    ctx.body = await ctx.service.user.saveInfo({client_id, username, phonenum, logourl, gender, email});
  }

  async find() {
    const { ctx } = this;
    const { client_id } = ctx.query;
    ctx.body = await ctx.service.user.find({ client_id });
  }
}

module.exports = UserController;
