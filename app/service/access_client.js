'use strict';

const { Service } = require('egg');
// const Token = require('../utils/token').default;
// const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
// const moment = require('moment');

class AccessService extends Service {
  /**
   * 合伙人端登录:
   * 判断数据库中是否存在该 openid
   * 若不存在则无法登录, 提示填写注册单
   * 若存在则返回 Partner 数据
   * @param openid string - your openid
   */
  async login(openid, unionid) {
    const { ctx } = this;
    const where = { openid };

    try {
      const { XqClient, Address } = ctx.model;
      let client = await XqClient.findOne({ where, include: [{ model: Address }], });
      if (client) {
        client = JSON.parse(JSON.stringify(client));
      }
      if (!client) {
        // 用户不存在, 则添加新用户
        client = await XqClient.create({ id: ctx.uuid32, openid, unionid });
        client = client.dataValues;
        // 创建并生成token,然后返回
        client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid } });
        return ctx.message.login.newuser(client);
      } else if (client && !client.unionid && unionid) {
        await XqClient.update({ unionid }, { where: { openid } });
        client.unionid = unionid;
      }
      // 创建并生成token,然后返回
      // client = client.dataValues;
      client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid } });
      // 返回正常用户信息
      return ctx.message.success(client);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = AccessService;
