'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class BannerService extends BaseService {
  /**
   * 查询Banners
   * @param {*} options 
   */
  async findAll({area_id}) {
    const { ctx } = this;
    const { Banners } = ctx.model;
    try {
      // 排序关系
      const orderby = [['priority', 'ASC']];
      // 1. 查询数据
      const banners = await Banners.findAll({ where: { area_id }, order: orderby });
      // 2. 如数据不存在, 提供统一 Banner
      if (_.isArray(banners) && banners.length === 0) {

      }
      return ctx.message.success(banners);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = BannerService;
