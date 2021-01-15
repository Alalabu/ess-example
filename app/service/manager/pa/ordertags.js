'use strict';
const _ = require('lodash');
const BaseService = require('../../base/base');

/**
 * 商圈管理
 */
class OrdertagsService extends BaseService {

  async create({ storetag_id, tag_name, priority }) {
    const { ctx } = this;
    const { StoreTagsOrder } = ctx.model;
    try {
      // 1. 添加商圈
      const storeTagsOrder = await StoreTagsOrder.create({
        id: ctx.uuid32, storetag_id, tag_name, priority
      });
      return ctx.message.success(storeTagsOrder);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async update({tag_id, storetag_id, tag_name, priority}) {
    const { ctx } = this;
    const { StoreTagsOrder } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreTagsOrder.update(
        _.omitBy({storetag_id, tag_name, priority}, _.isNil) , {
        where: { id: tag_id }
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async delete({ tag_id }) {
    const { ctx } = this;
    const { StoreTagsOrder } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreTagsOrder.destroy({ where: { id: tag_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async find({ tag_id }) {
    const { ctx } = this;
    const { StoreTagsOrder } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreTagsOrder.findOne({ where: { id: tag_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = OrdertagsService;
