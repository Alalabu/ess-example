'use strict';
const _ = require('lodash');
const BaseService = require('../../base/base');

/**
 * 商圈管理
 */
class StoretagsService extends BaseService {

  async create({ area_id, tag_name, tag_code, priority }) {
    const { ctx } = this;
    const { StoreTags } = ctx.model;
    try {
      // 1. 添加商圈
      const storeTags = await StoreTags.create({
        id: ctx.uuid32, area_id, tag_name, tag_code, priority, struts: '1'
      });
      return ctx.message.success(storeTags);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async update({area_id, tag_id, tag_name, tag_code, priority, struts}) {
    const { ctx } = this;
    const { StoreTags } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      console.log('update: ', _.omitBy({tag_id, area_id, tag_name, tag_code, priority, struts}, _.isNil));
      const result = await StoreTags.update(
        _.omitBy({area_id, tag_name, tag_code, priority, struts}, _.isNil) , {
        where: { id: tag_id }
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async delete({ tag_id }) {
    const { ctx } = this;
    const { StoreTags } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreTags.destroy({ where: { id: tag_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async find({ tag_id }) {
    const { ctx } = this;
    const { StoreTags } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreTags.findOne({ where: { id: tag_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = StoretagsService;
