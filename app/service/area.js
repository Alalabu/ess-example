'use strict';
const BaseService = require('./base/base');

const CACHE_PROVINCE = Symbol('provinceAll');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class AreaService extends BaseService {
  async provinceAll() {
    // 判断缓存
    const cacheData = await this.getCache(CACHE_PROVINCE);
    if (cacheData) {
      console.log('[Redis cacheData] use redis by cacheKey=provinceAll.');
      return cacheData;
    }
    const { ctx } = this;
    const { Province } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const provinces = await Province.findAll({});
      // 数据缓存
      const seconds = 60 * 60 * 24 * 7;
      await this.setCache(CACHE_PROVINCE, provinces, seconds);
      return { msg: 'ok', data: provinces };
    } catch (err) {
      ctx.logger.error(err);
      return { err };
    }
  }

  async cityAll(provincecode) {
    // 判断缓存
    const cacheData = await this.getCache(`city/findAll?provincecode=${provincecode}`);
    if (cacheData) {
      console.log('[Redis cacheData] use redis by cacheKey=provinceAll.');
      return cacheData;
    }
    const { ctx } = this;
    const { City } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const cties = await City.findAll({ where: { provincecode } });
      // 数据缓存
      const seconds = 60 * 60 * 24 * 7;
      await this.setCache(CACHE_PROVINCE, cties, seconds);
      return { msg: 'ok', data: cties };
    } catch (err) {
      ctx.logger.error(err);
      return { err };
    }
  }

  async districtAll(citycode) {
    const { ctx } = this;
    const { District } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const districts = await District.findAll({ where: { citycode } });
      return { msg: 'ok', data: districts };
    } catch (err) {
      ctx.logger.error(err);
      return { err };
    }
  }
}

module.exports = AreaService;
