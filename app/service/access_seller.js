'use strict';

const { Service } = require('egg');
// const Token = require('../utils/token').default;
// const jwt = require('jsonwebtoken');
// const uuidv1 = require('uuid/v1');
// const moment = require('moment');

class AccessService extends Service {
  /**
   * 商户端登录:
   * 判断数据库中是否存在该 openid
   * 若不存在则无法登录, 提示填写注册单
   * 若存在则返回 Partner 数据
   * @param openid string - your openid
   */
  async login({openid, unionid, phonenum}) {
    const { ctx } = this;
    let where = null;
    if (openid && phonenum) where = { phonenum }; // 同时存在, 查询条件是 手机号码
    else where = { openid };  // 手机号码不存在, 查询条件则是 openid

    try {
      const { XqStore, XqSubSeller } = ctx.model;
      let client = await XqSubSeller.findOne({ where, raw: true });
      if (!client) {
        // 手机号码不存在数据库
        if(phonenum) return ctx.message.access.invalidPhone(phonenum);
        // 临时凭证
        client = {
          loginToken: ctx.generateToken({
            params: { openid, unionid, phonenum }, 
            secret: ctx.app.config.jwt.secret,
            expiresIn: (5 * 60),
          })
        };
        return ctx.message.access.noPhone(client); // 返回未绑定手机号码的状态
      } else if (client && client.phonenum === phonenum && (!client.unionid || !client.openid)) {
        await XqSubSeller.update({ openid, unionid }, { where: { phonenum } });
        client.openid = openid;
        client.unionid = unionid;
      }
      // 判断商家启用权限
      if (client.struts !== '1') {
        return ctx.message.access.strutsDisabled(client);
      }
      // 连接商铺
      client.store = await XqStore.findOne({ where: { id: client.store_id }, raw: true });
      // 创建并生成token,然后返回
      client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid, level: client.level } });
      return ctx.message.success(client);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = AccessService;
