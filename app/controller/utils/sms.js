'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

class SmsController extends Controller {
  /**
   * 发送短信接口
   */
  async send() {
    const { ctx } = this;
    const { phonenum } = ctx.request.body;
    if (!phonenum) {
      ctx.body = ctx.message.param.miss({ phonenum });
      return;
    }
    ctx.body = await ctx.service.utils.sms.send(phonenum);
  }

  /**
   * 短信 code 有效性验证
   */
  async verify() {
    const { ctx } = this;
    const { phonenum, sms_code, sms_token } = ctx.request.body;
    if (!phonenum || !sms_code || !sms_token) {
      ctx.body = ctx.message.param.miss({ phonenum, sms_code, sms_token });
      return;
    }
    ctx.body = await ctx.service.utils.sms.verify(phonenum, sms_code, sms_token);
  }
}

module.exports = SmsController;
