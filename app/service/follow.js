'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 关注 管理
 */
class FollowService extends BaseService {
  /**
   * 新增关注
   */
  async create({ client_id, store_id }) {
    const {ctx} = this;
    try {
      const { StoreSubscibe } = ctx.model;
      // 1. 新增关注
      const result = await StoreSubscibe.create({
        id: ctx.uuid32, client_id, store_id,
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除关注
   */
  async cancel({ client_id, store_id }) {
    const {ctx} = this;
    try {
      const { StoreSubscibe } = ctx.model;
      const result = await StoreSubscibe.destroy({
        where: { client_id, store_id }
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询关注列表
   */
  async findAll({ client_id, hasStore, pageIndex }) {
    const {ctx} = this;
    try {
      const { StoreSubscibe, XqStore } = ctx.model;
      // 查询配置
      const query_options = { 
        where: { client_id },
        order: [['create_at', 'DESC']],
      };
      // 是否拼接商户信息
      if (hasStore) {
        query_options.include = [{ model: XqStore, required: true }];
      }
      // 是否分页
      if (Number(pageIndex) > 0) {
        query_options.limit = 20;
        query_options.offset = (query_options.limit * ( pageIndex - 1 ));
      }
      // 查询
      const result = await StoreSubscibe.findAll(query_options);
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = FollowService;
