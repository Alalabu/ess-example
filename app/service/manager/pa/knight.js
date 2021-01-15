'use strict';
const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const BaseService = require('../../base/base');

/**
 * Knight 管理
 */
class KnightService extends BaseService {

  async create({username, gender, phonenum, area_id}) {
    const { ctx } = this;
    const { XqKnight } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const knight = await XqKnight.findOne({ where: { phonenum }, raw: true });
      if(knight) {
        return ctx.message.result.repetition(phonenum, '骑手手机号码重复');
      }
      // 新增骑手
      const struts = 1; // 骑手状态: 1 启用
      const result = await XqKnight.create({id: ctx.uuid32, struts, username, gender, phonenum, area_id});
      return ctx.message.success(result, '新增成功');
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async update({ knight_id, logourl, pid, username, gender, phonenum, area_id }) {
    const { ctx } = this;
    const { XqKnight } = ctx.model;
    try {
      const knight = await XqKnight.findOne({ where: { phonenum, id: {[Op.ne]: knight_id} }, raw: true });
      if(knight) {
        return ctx.message.result.repetition(phonenum, '骑手手机号码重复');
      }
      // 1. 如果用户不存在则新增用户
      const result = await XqKnight.update(
        _.omitBy({logourl, pid, username, gender, phonenum, area_id}, _.isNil), {
        where: { id: knight_id }
      });
      return ctx.message.success(result, '修改成功');
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async remove(knight_id) {
    const { ctx } = this;
    const { XqKnight } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const struts = 0; // 骑手状态: 1 启用
      const result = await XqKnight.update({ struts }, { where: { id: knight_id } });
      return ctx.message.success(result, '删除成功');
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = KnightService;
