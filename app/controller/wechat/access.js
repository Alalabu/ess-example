'use strict';
const _ = require('lodash');
const { Controller } = require('egg');

const {
  MP_ACCESS_TOKEN, SJ_CLIENT_ACCESS_TOKEN, SJ_SELLER_ACCESS_TOKEN
} = require('../../util/strings');

class AccessController extends Controller {

  /**
   * 用于获取 社有公众号 的 accesstoken
   * 接口: /wechat/getAccessToken
   */
  async officialAccessToken() {
    const ctx = this.ctx;
    // 参数部分
    const { key, timeStamp, nonceStr, sign } = ctx.request.body;
    if (!key || !timeStamp || !nonceStr || !sign) { // 验证参数有效性
      ctx.body = ctx.message.param.miss({ key, timeStamp, nonceStr, sign });
      return;
    }

    try {
      const secret = await ctx.service.wechat.external.getUserSecret(key);
      if (!_.isString(secret) || !ctx.equalsSign({ key, timeStamp, nonceStr }, secret, sign)) {
        // 签名不符
        ctx.body = secret;
        return;
      }
      // 获取 AccessToken
      const accessToken = await ctx.app.registryClient.getConfig(MP_ACCESS_TOKEN);
      if (!accessToken) {
        ctx.body = ctx.message.role.accessTokenInvalid('mp_access_token');
        return;
      }
      ctx.body = ctx.message.success({ access_token: accessToken, expires_in: 7200 });
    } catch (error) {
      ctx.body = ctx.message.exception(error, 'mp_access_token');
    }

    // const ctx = this.ctx;
    // const accessToken = await ctx.app.registryClient.getConfig(MP_ACCESS_TOKEN);
    // if (!accessToken) {
    //   ctx.body = ctx.message.role.accessTokenInvalid('AccessController');
    //   return;
    // }
    // ctx.body = ctx.message.success({ access_token: accessToken, expires_in: 7200 });
  }

  /**
   * 用于获取 小券用户端 的 AccessToken
   * 接口: /sj_client/accessToken
   */
  async sjClientAccessToken() {
    const ctx = this.ctx;
    // 参数部分
    const { key, timeStamp, nonceStr, sign } = ctx.request.body;
    if (!key || !timeStamp || !nonceStr || !sign) { // 验证参数有效性
      ctx.body = ctx.message.param.miss({ key, timeStamp, nonceStr, sign });
      return;
    }

    try {
      const secret = await ctx.service.wechat.external.getUserSecret(key);
      if (!_.isString(secret) || !ctx.equalsSign({ key, timeStamp, nonceStr }, secret, sign)) {
        // 签名不符
        ctx.body = secret;
        return;
      }
      // 获取 AccessToken
      const accessToken = await ctx.app.registryClient.getConfig(SJ_CLIENT_ACCESS_TOKEN);
      if (!accessToken) {
        ctx.body = ctx.message.role.accessTokenInvalid('sj_client');
        return;
      }
      ctx.body = ctx.message.success({ access_token: accessToken, expires_in: 7200 });
    } catch (error) {
      ctx.body = ctx.message.exception(error, 'sj_client');
    }
  }

  /**
   * 用于获取 小券店主端 的 AccessToken
   * 接口: /xq/supplier/accessToken
   * 参数:
   *
   * 返回数据:
   *
   */
  async sjSellerAccessToken() {
    const ctx = this.ctx;
    // 参数部分
    const { key, timeStamp, nonceStr, sign } = ctx.request.body;
    if (!key || !timeStamp || !nonceStr || !sign) {
      ctx.body = ctx.message.param.miss({ key, timeStamp, nonceStr, sign });
      return;
    }

    try {
      const secret = await ctx.service.wechat.external.getUserSecret(key);
      if (!_.isString(secret) || !ctx.equalsSign({ key, timeStamp, nonceStr }, secret, sign)) {
        // 签名不符
        ctx.body = secret;
        return;
      }
      // 获取 AccessToken
      const accessToken = await ctx.app.registryClient.getConfig(SJ_SELLER_ACCESS_TOKEN);
      if (!accessToken) {
        ctx.body = ctx.message.role.accessTokenInvalid('sj_seller');
        return;
      }
      ctx.body = ctx.message.success({ access_token: accessToken, expires_in: 7200 });
    } catch (error) {
      // const err = new Message({ err: ErrorType.SIGN_EXCEPTION, data: error });
      // console.log('出错啦 => ', err);
      // ctx.logger.warn(err);
      // ctx.body = err;
      ctx.body = ctx.message.exception(error, 'sj_seller');;
    }
  }
}

module.exports = AccessController;
