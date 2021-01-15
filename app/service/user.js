'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 用户 管理
 */
class UserService extends BaseService {

  /**
   * 保存用户信息
   */
  async saveInfo({ client_id, username, phonenum, logourl, gender, email }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    if (!client_id) client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.param.miss({client_id});
    const saveData = _.omitBy({username, phonenum, logourl, gender, email}, _.isNil);
    try {
      const { XqClient } = ctx.model;
      const result = await XqClient.update(saveData, { where: { id: client_id } });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询用户信息
   */
  async find({ client_id }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    if (!client_id) client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.param.miss({client_id});
    try {
      const { XqClient } = ctx.model;
      const result = await XqClient.findOne({ where: { id: client_id } });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = UserService;
