'use strict';

const { Controller } = require('egg');
const SJAPP = require('../util/client-apps');
// const WXUnionCrypt = require('../util/WXUnionCrypt');

class AccessClientController extends Controller {
  /**
   * 使用 unionid 的登录方法
   * 通过 code 换取登录的 openid 和 unionid, 记录数据库
   * 创建用于登录的token,并返回
   *
   * 接口: /access/login
   * Method: post
   * 参数:
   *      appid: 应用标识
   *      loginCode: wx.login的res中获取的code
   *      encryptedData: 敏感数据加密字符串, getUserInfo的res中获取
   *      iv: 加密用到的iv, getUserInfo的res中获取
   * 返回数据:
   *      Message
   *
   */
  async login() {
    const { ctx } = this;
    // 参数部分
    const { loginCode, phonenum } = ctx.request.body;
    // 首先通过 loginCode 换取 session_key (mmp)
    const wxurl = `https://api.weixin.qq.com/sns/jscode2session?appid=${SJAPP.Client.appid}&secret=${SJAPP.Client.appsecret}&js_code=${loginCode}&grant_type=authorization_code`;
    // 换取的结果中包含 openid 及 session_key
    const wx_result = (await ctx.curl(wxurl, { dataType: 'json' })).data;
    // openid不存在的情况
    if (!wx_result.openid) {
      ctx.body = ctx.message.access.noOpenid(wx_result); //noUnionidOrSessionKey
      return;
    }
    const { openid, unionid } = wx_result;
    // 不存在 unionid
    // if (!unionid) {
    //   ctx.body = ctx.message.access.noUnionidOrSessionKey(wx_result);
    //   return;
    // }

    try {
      ctx.body = await ctx.service.accessClient.login(openid, unionid, phonenum);
    } catch (error) {
      ctx.body = ctx.message.exception(error);
    }
  }// end: clientLogin
}

module.exports = AccessClientController;
