'use strict';
const BaseService = require('../../base/base');

/**
 * Banner 管理
 */
class BannerService extends BaseService {

  async create({picurl, priority, area_id}) {
    const { ctx } = this;
    // 获取操作用户
    const master_id = ctx.auth?.id;
    if(!master_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    const { Banners } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await Banners.create({ id: ctx.uuid32, master_id, picurl, priority, area_id });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async delete(banner_id) {
    const { ctx } = this;
    // 获取操作用户
    const master_id = ctx.auth?.id;
    if(!master_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    const { Banners } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await Banners.destroy({ where: { id: banner_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = BannerService;
