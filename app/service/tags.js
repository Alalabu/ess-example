'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class TagsService extends BaseService {
  /**
   * 查询商户列表
   * @param {*} options 
   */
  async tagsFindAll({area_id, hasStore}) {
    const { ctx } = this;
    const { StoreTags, XqStore } = ctx.model;
    try {
      // 关联关系
      const include = [];
      if (hasStore) include.push({ model: XqStore });
      // 排序关系
      const orderby = [['priority', 'ASC']];
      // 1. 如果用户不存在则新增用户
      const storeTags = await StoreTags.findAll({ where: { area_id }, include, order: orderby });
      return ctx.message.success(storeTags);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询商户类别订单标签 (列表)
   * @param {*} options 
   */
  async orderTagsFindAll({storetag_id}) {
    const { ctx } = this;
    const { StoreTagsOrder } = ctx.model;
    try {
      // 排序关系
      const orderby = [['priority', 'ASC']];
      // 1. 如果用户不存在则新增用户
      const orderStoreTags = await StoreTagsOrder.findAll({ where: { storetag_id }, order: orderby, raw: true });
      return ctx.message.success(orderStoreTags);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = TagsService;
