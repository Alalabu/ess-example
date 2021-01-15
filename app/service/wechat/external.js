'use strict';
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class ExternalService extends BaseService {
  /**
   * 通过 key 换取 secret
   * @param {*} user_key 用户的 key
   */
  async getUserSecret(user_key) {
    const { ctx } = this;
    const { ApiAuthorization } = ctx.model;
    // 调用 getConfig 接口
    const author = await ApiAuthorization.findOne({
      where: {
        user_key,
      },
    });
    if (!author || !author.user_secret) {
      return ctx.message.role.low();
    }
    return author.user_secret;
  }
}

module.exports = ExternalService;
