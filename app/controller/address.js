'use strict';

const Controller = require('egg').Controller;

class AddressController extends Controller {

  /**
   * 新增地址
   */
  async create() {
    const { ctx } = this;
    const { username, gender, mobile, area_id, area_scope, detail } = ctx.request.body;
    if (!username || !gender || !mobile || !area_id || !area_scope || !detail) {
      ctx.body = ctx.message.param.miss({ username, gender, mobile, area_id, area_scope, detail });
      return;
    }
    ctx.body = await ctx.service.address.create({ username, gender, mobile, area_id, area_scope, detail });
  }

  /**
   * 修改地址
   */
  async update() {
    const { ctx } = this;
    const { address_id, username, gender, mobile, area_id, area_scope, detail } = ctx.request.body;
    if (!address_id) {
      ctx.body = ctx.message.param.miss({ address_id, username, gender, mobile, area_id, area_scope, detail });
      return;
    }
    ctx.body = await ctx.service.address.update({ address_id, username, gender, mobile, area_id, area_scope, detail });
  }

  /**
   * 删除地址
   */
  async delete() {
    const { ctx } = this;
    const { address_id } = ctx.request.body;
    if (!address_id) {
      ctx.body = ctx.message.param.miss({ address_id });
      return;
    }
    ctx.body = await ctx.service.address.delete({ address_id });
  }

  /**
   * 设置默认地址
   */
  async setDefault() {
    const { ctx } = this;
    const { address_id } = ctx.request.body;
    if (!address_id) {
      ctx.body = ctx.message.param.miss({ address_id });
      return;
    }
    ctx.body = await ctx.service.address.setDefault({ address_id });
  }

  /**
   * 查询地址单例
   */
  async find() {
    const { ctx } = this;
    const { address_id } = ctx.query;
    if (!address_id) {
      ctx.body = ctx.message.param.miss({ address_id });
      return;
    }
    ctx.body = await ctx.service.address.find({ address_id });
  }

  /**
   * 新增地址
   */
  async findAll() {
    const { ctx } = this;
    // const { username, gender, mobile, area_id, area_scope, detail } = ctx.request.body;
    // if (!username || !gender || !mobile || !area_id || !area_scope || !detail) {
    //   ctx.body = ctx.message.param.miss({ username, gender, mobile, area_id, area_scope, detail });
    //   return;
    // }
    ctx.body = await ctx.service.address.findAll();
  }
}

module.exports = AddressController;
