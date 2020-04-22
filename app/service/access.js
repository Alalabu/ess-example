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
  async clientLogin(openid, unionid) {
    const { ctx } = this;
    const where = { openid };

    try {
      const { XqClient } = ctx.model;
      let client = await XqClient.findOne({ where });
      // console.log('【partnerLogin openid】=> ', openid);
      if (!client) {
        // 用户不存在, 则添加新用户
        client = await XqClient.create({ id: uuidv1(), openid, unionid });
        client = client.dataValues;
        // 创建并生成token,然后返回
        client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid } });
        return { desc: 'new_user', data: client };
      } else if (client && !client.unionid && unionid) {
        await XqClient.update({ unionid }, { where: { openid } });
      }
      // 创建并生成token,然后返回
      client = client.dataValues;
      client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid } });
      // return { data: client };
      return ctx.returnSuccess({ data: client });
    } catch (err) {
      this.logger.error('clientLogin => ', JSON.stringify(err));
      console.log('【partnerLogin ERROR】=> ', err);
      return { err: 1004, data: 'clientlogin exception!' };
    }
  }
}

module.exports = AccessService;
