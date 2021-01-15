'use strict';
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class UserService extends BaseService {
  async newOrder(username, price) {
    const { ctx } = this;
    const sequelize = ctx.model;
    const { Order, Client } = sequelize;
    // 开启一个事务
    const transaction = await ctx.model.transaction();
    try {
      // 1. 如果用户不存在则新增用户
      const clients = await Client.findAll({
        where: { nickname: username },
      });
      const u = {
        id: uuidv1(), nickname: username, created: new Date(),
      };
      if (clients.length === 0) {
        await Client.create(u, { transaction });
      }
      // 2. 新增订单
      const order = { id: uuidv1(),
        clientid: uuidv1(), total_fee: price, created: new Date() };
      console.log('【add order】 ： ', order);
      const orderInput = await Order.create(_.omitBy(order, _.isNil), { transaction });
      await transaction.commit();
      return { msg: 'ok', data: { user: u, order } };
    } catch (err) {
      // const msg = new Message({err: ErrorType.DATABASE_ERROR, data: err});
      console.error('【ERROR add order】： ', err);
      ctx.logger.error(err);
      await transaction.rollback();
      return { err };
    }
  }
}

module.exports = UserService;
