'use strict';
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class SwopService extends BaseService {
  /**
   * 通过 unionid 换取 openid
   * @param {String} unionid 用户的 unionid
   */
  async unionidToOfficial(unionid) {
    const { ctx } = this;
    const { SheuUser } = ctx.model;
    // 调用 getConfig 接口
    const user = await SheuUser.findOne({
      where: {
        unionid,
      },
      raw: true,
    });
    if (!user) {
      return ctx.message.official.noUserUnionid(unionid, 'unionid not found!');
    }
    return ctx.message.success(user);
  }
}

module.exports = SwopService;
