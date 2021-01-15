'use strict';
const _ = require('lodash');
const {Calendar, CalendarTypes} = require('calendar2');
const BaseService = require('./base/base');

/**
 * 营养计划 管理
 * 营养计划是用户自拟的，通过自身的（性别、身高、体重）来确定每日营养所需的均值
 * 计划仅仅作为一个标准，具体类比结果应参考每日消耗
 */
class SfmnpService extends BaseService {

  /**
   * 取消其他的营养计划默认值
   * @param {*} client_id 
   * @param {*} option 
   */
  async cancelDefaultAnother(client_id, { transaction }) {
    const {ctx} = this;
    const { XqClientNst } = ctx.model;
    try {
      const option = { where: { client_id, is_default: '1' } };
      if (transaction) {
        option.transaction = transaction;
      }
      const result = await XqClientNst.update({
        is_default: '0',
      }, option);
      const affect_rows = result[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        throw '并未取消任何其他默认计划';
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * 新增营养计划
   */
  async create(options) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    let { client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = options;
    // 事务
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { XqClientNst } = ctx.model;
      // 1. 查询当前营养计划是否是默认
      const addr_count = await XqClientNst.count({ where: { client_id } });
      // console.log('营养计划数量: ', addr_count);
      if (addr_count > 0 && is_default === '1') { // 取消其他计划,将此计划设置为首要计划
        await this.cancelDefaultAnother(client_id, { transaction });
      } else if ( addr_count === 0) { // 没有其他计划, 本计划为默认计划
        is_default = '1';
      }
      // 2. 新增营养计划
      const result = await XqClientNst.create({
        id: ctx.uuid32, client_id, recom_id, 
        category_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
        ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi
      }, {transaction});

      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 修改营养计划
   */
  async update(options) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    let { sfmnp_id, client_id, category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, ssxw, wssa, las, su, 
      ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi } = options;
    // 事务
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { XqClientNst } = ctx.model;
      const saveData = _.omitBy({category_id, recom_id, title, age, gender, stature, weight, is_default, rl, zf, dbz, shhf, 
        ssxw, wssa, las, su, ys, wsfc, wsse, shc, lb, dgc, gai, mei, tei, meng, xin, tong, jia, ling, la, xi}, _.isNil);
      // 判断默认值设置
      let plan_count = 0;
      if (is_default != null && client_id) {
        plan_count = await XqClientNst.count({ where: { client_id } });
      }
      if (is_default === '1' && plan_count > 1) { // 将该计划设为默认, 并且计划总数大于 1 时
        await this.cancelDefaultAnother(client_id, { transaction }); // 取消别的默认计划
      } else if(is_default === '0') { // 取消默认计划,但默认计划的数量 <= 1
        // 禁止取消默认计划, 只能将别的项变为默认计划时, 自动取消当前的默认计划
        return ctx.message.foodplan.disableCancel({sfmnp_id, client_id}, '禁止取消默认计划, 只能将别的项变为默认计划时, 自动取消当前的默认计划');
      }
      // 变更修改数据
      const result = await XqClientNst.update(saveData, {
        where: { id: sfmnp_id, client_id }
      });

      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除营养计划
   */
  async delete(options) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const { sfmnp_id, client_id } = options;
    try {
      const { XqClientNst } = ctx.model;
      const result = await XqClientNst.destroy({
        where: { id: sfmnp_id, client_id, is_default: '0' }
      });
      if (!result) {
        return ctx.message.foodplan.disableDelete({sfmnp_id, client_id});
      }
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询默认营养计划(单例)
   */
  async defaultOne({ client_id }) {
    const {ctx} = this;
    try {
      const { XqClientNst } = ctx.model;
      const result = await XqClientNst.findOne({ where: { client_id, is_default: '1' }, raw: true });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询营养计划信息
   */
  async find({ sfmnp_id }) {
    const {ctx} = this;
    try {
      const { XqClientNst } = ctx.model;
      const result = await XqClientNst.findOne({ where: { id: sfmnp_id }, raw: true });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询营养计划列表
   */
  async findAll({ client_id }) {
    const {ctx} = this;
    try {
      const { XqClientNst } = ctx.model;
      const orderby = [['is_default', 'DESC'], ['create_at', 'DESC']];
      const result = await XqClientNst.findAll({ where: { client_id }, order: orderby, raw: true });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = SfmnpService;
