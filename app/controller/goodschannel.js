'use strict';

const Controller = require('egg').Controller;

class GoodschannelController extends Controller {

  /**
   * 新增频道
   */
  async create() {
    const { ctx } = this;
    const { store_id, title, priority } = ctx.request.body;
    if (!store_id || !title || !priority) {
      ctx.body = ctx.message.param.miss({ store_id, title, priority });
      return;
    }
    ctx.body = await ctx.service.goodschannel.create({ store_id, title, priority });
  }

  /**
   * 修改频道
   */
  async update() {
    const { ctx } = this;
    const { channel_id, store_id, title, priority } = ctx.request.body;
    if (!channel_id || !store_id) {
      ctx.body = ctx.message.param.miss({ channel_id, store_id, title, priority });
      return;
    }
    ctx.body = await ctx.service.goodschannel.update({ channel_id, store_id, title, priority });
  }

  /**
   * 删除频道
   */
  async delete() {
    const { ctx } = this;
    const { store_id, channel_id } = ctx.request.body;
    if (!store_id || !channel_id) {
      ctx.body = ctx.message.param.miss({ store_id, channel_id });
      return;
    }
    ctx.body = await ctx.service.goodschannel.delete({ store_id, channel_id });
  }

  /**
   * 查询地址单例
   */
  async find() {
    const { ctx } = this;
    const { channel_id, has_goods } = ctx.query;
    if (!channel_id) {
      ctx.body = ctx.message.param.miss({ channel_id, has_goods });
      return;
    }
    ctx.body = await ctx.service.goodschannel.find({ channel_id, has_goods });
  }

  /**
   * 新增地址
   */
  async findAll() {
    const { ctx } = this;
    const { store_id, has_goods } = ctx.query;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id, has_goods });
      return;
    }
    ctx.body = await ctx.service.goodschannel.findAll({ store_id, has_goods });
  }
}

module.exports = GoodschannelController;
