'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 地址 管理
 */
class AddressService extends BaseService {
  /**
   * 新增地址
   */
  async create({ username, gender, mobile, area_id, area_scope, detail }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.auth.noUser({client_id});
    try {
      const { Address } = ctx.model;
      // // 1. 查询当前地址是否是第一条
      const addr_count = await Address.count({ where: { client_id } });
      console.log('地址数量: ', addr_count);
      const is_default = (addr_count > 0) ? '0' : '1';
      // 2. 新增地址
      const result = await Address.create({
        id: ctx.uuid32, client_id, 
        username, gender, mobile, area_id, area_scope, detail, is_default
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 修改地址
   */
  async update({ address_id, username, gender, mobile, area_id, area_scope, detail }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.auth.noUser({client_id});
    try {
      const { Address } = ctx.model;
      const saveData = _.omitBy({username, gender, mobile, area_id, area_scope, detail}, _.isNil);
      const result = await Address.update(saveData, {
        where: { id: address_id, client_id }
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除地址
   */
  async delete({ address_id }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.auth.noUser({client_id});
    try {
      const { Address } = ctx.model;
      const result = await Address.destroy({
        where: { id: address_id, client_id }
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 设置默认地址
   */
  async setDefault({ address_id }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.auth.noUser({client_id});
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { Address } = ctx.model;
      // 1. 设置其他地址取消默认
      await Address.update({
        is_default: '0'
      }, {
        where: { client_id, is_default: '1' }, transaction
      });
      // 2. 设置当前地址为默认地址
      const result = await Address.update({
        is_default: '1'
      }, {
        where: { id: address_id, client_id }, transaction
      });
      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询地址信息
   */
  async find({ address_id }) {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    // const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    // if (!client_id) return ctx.message.param.miss({client_id});
    try {
      const { Address } = ctx.model;
      const result = await Address.findOne({ where: { id: address_id }, raw: true });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询地址列表
   */
  async findAll() {
    const {ctx} = this;
    // 如果用户信息不存在, 在auth中查询
    const client_id = ctx.auth.id;
    // 依然不存在就过分了哦
    if (!client_id) return ctx.message.param.miss({client_id});
    try {
      const { Address } = ctx.model;
      const orderby = [['is_default', 'DESC'], ['create_at', 'DESC']];
      const result = await Address.findAll({ where: { client_id }, order: orderby, raw: true });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = AddressService;
