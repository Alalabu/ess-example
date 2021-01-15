'use strict';
const _ = require('lodash');
const { Controller } = require('egg');

class SwopController extends Controller {

  /**
   * 通过 unionid 换取某APP的用户信息
   * (待完善) 若未指定 appid 则换取公众号的用户
   * 参数: { unionid, AuthO2 }
   * 接口: /official/user
   */
  async unionidToOfficial() {
    const ctx = this.ctx;
    // 参数部分
    const { key, timeStamp, nonceStr, sign, unionid } = ctx.request.body;
    if (!key || !timeStamp || !nonceStr || !sign || !unionid) { // 验证参数有效性
      ctx.body = ctx.message.param.miss({ key, timeStamp, nonceStr, sign, unionid });
      return;
    }
    const secret = await ctx.service.wechat.external.getUserSecret(key);
    if (!_.isString(secret) || !ctx.equalsSign({ key, timeStamp, nonceStr, unionid }, secret, sign)) {
      // 签名不符
      ctx.body = secret;
      return;
    }
    const officialUserRes = await ctx.service.wechat.swop.unionidToOfficial(unionid);
    ctx.body = officialUserRes;
  }
}

module.exports = SwopController;
