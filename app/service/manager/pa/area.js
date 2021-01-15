'use strict';
const BaseService = require('../../base/base');

/**
 * 商圈管理
 */
class AreaService extends BaseService {

  async findAll(testId) {
    const { ctx } = this;
    // 获取操作用户
    const manager_id = ctx.auth?.id ?? testId;
    if(!manager_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    const { ManagerAreaRelation, StoreArea } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const include = [{
        model: ManagerAreaRelation, where: { manager_id }, attributes: [],
      }];
      const result = await StoreArea.findAll({ include, raw: true });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async tablesign(area_id) {
    const { ctx } = this;
    // 获取操作用户
    const { StoreTablesign } = ctx.model;
    try {
      const result = await StoreTablesign.findAll({ where: {area_id}, raw: true });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = AreaService;
