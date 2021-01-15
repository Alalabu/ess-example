'use strict';

const { Service } = require('egg');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class AccessService extends Service {
  /**
   * 合伙人端登录:
   * 判断数据库中是否存在该 openid
   * 若不存在则无法登录, 提示填写注册单
   * 若存在则返回 Partner 数据
   * @param openid string - your openid
   */
  async login(openid, unionid, phonenum) {
    const { ctx } = this;
    // const where = { openid };
    let where = null;
    if (openid && phonenum) {
      where = { phonenum };
    } else {
      where = { openid };
    }

    try {
      const { XqManager, ManagerAreaRelation, StoreArea } = ctx.model;
      const include = [{
        model: ManagerAreaRelation, include: [{ model: StoreArea }]
      }];
      let client = await XqManager.findOne({ where, include });
      client = JSON.parse(JSON.stringify(client));
      if (!client) {
        if(phonenum) {
          // 手机号码不存在数据库
          return ctx.message.access.invalidPhone(phonenum);
        }
        // 用户不存在, 则添加新用户
        // client = await XqManager.create({ id: ctx.uuid32, openid, unionid });
        // client = client.dataValues;
        // 创建并生成token,然后返回
        // client.loginToken = ctx.generateToken({ params: { id: client.id, openid, unionid } });
        // 临时凭证
        client = {
          loginToken: ctx.generateToken({
            params: { openid, unionid, phonenum }, 
            secret: ctx.app.config.jwt.secret,
            expiresIn: (5 * 60),
          })
        };
        return ctx.message.access.noPhone(client); // 返回未绑定手机号码的状态
      } else if (client && !client.unionid && unionid) { // 重新更新用户的 unionid
        await XqManager.update({ openid, unionid }, { where: { id: client.id } });
        client.openid = openid;
        client.unionid = unionid;
      }
      // client = client.dataValues; // 用户数据的原始信息
      let tokenSecret = null;
      if (client.level === 'admin') {
        tokenSecret = ctx.app.config.jwt.sa_secret;
      } else if (client.level === 'common') {
        tokenSecret = ctx.app.config.jwt.pa_secret;
      }
      client.loginToken = ctx.generateToken({ 
        params: { id: client.id, openid, unionid, level: client.level },
        secret: tokenSecret,
        expiresIn: (7 * 24 * 60 * 60)
      });
      // 查看用户手机号码是否已存在
      if(!client.phonenum) {
        return ctx.message.access.noPhone(client); // 返回未绑定手机号码的状态
      }
      // 返回正常用户信息
      return ctx.message.success(client);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = AccessService;
