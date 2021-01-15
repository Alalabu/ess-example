'use strict';
const _ = require('lodash');
const { CacheAreaListKey, CacheAreaProvinceKey } = require('../util/redis-key');
const BaseService = require('./base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class StoreareaService extends BaseService {

  /**
   * 查询商圈单例
   * 若 longitude, latitude 存在, 则检索距离最近的商圈
   * @param {*} param0 
   */
  async find({ area_id, longitude, latitude, hasStore }) {
    const { ctx } = this;
    const { StoreArea, XqStore } = ctx.model;
    try {
      // 
      const include = [];
      if(hasStore) include.push({ model: XqStore });
      // 1. 查询商圈信息
      let storeArea = null;
      if (area_id) {
        storeArea = await StoreArea.findOne({ where: {id: area_id}, include });
      } else if (longitude && latitude) {
        const sequelize = ctx.model;
        storeArea = await StoreArea.findOne({
          include,
          order: [
            [ sequelize.fn('FN_LOCATION_ABS', latitude, longitude,
            sequelize.col('store_area.latitude'), sequelize.col('store_area.longitude')), 'ASC' ],
          ], limit: 1,
        });
      } else {
        throw new Error('商圈查询异常');
      }
      return ctx.message.success(storeArea);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 在缓存中查询商圈信息
   * @param {*} queryOpts 
   */
  async findAreaForRedis(queryOpts){
    let cacheKey = `${CacheAreaListKey}`;
    const areaList = await this.hashGetValues(cacheKey);
    if (_.isArray(areaList) && areaList.length > 0) {
      // 在商圈的缓存列表中过滤数据
      const currentList = areaList.filter( area => {
        for (const key of Object.keys(queryOpts)) {
          if (area[key] != queryOpts[key]) return false;
        }
        return true;
      });
      if (currentList.length > 0) {
        return currentList;
      }
    }
    return [];
  }

  /**
   * 查询商圈列表
   * @param {*} param0 
   */
  async findAll({ city, city_code, province, province_code, has_store_count }) {
    const { ctx } = this;
    // 判断缓存
    const queryParams = _.omitBy({city, city_code, province, province_code}, _.isNil);
    let cacheKey = null;
    if ((city || city_code || province || province_code) && !has_store_count) {
      // const qt = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
      cacheKey = `${CacheAreaListKey}`;
      const areaList = await this.findAreaForRedis(queryParams);
      if (_.isArray(areaList) && areaList.length > 0){
        return ctx.message.success(areaList);
      }
      // const cacheData = await this.getCache(cacheKey);
      // if (cacheData) {
      //   console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      //   return ctx.message.success(cacheData);
      // }
    }
    console.log('queryParams: ', queryParams);
    
    const sequelize = ctx.model;
    const { StoreArea } = ctx.model;
    try {
      // 查询配置
      const query_opts = {};
      if (has_store_count) {
        query_opts.where = queryParams;
      }
      // 附属商铺数量
      if (has_store_count) {
        query_opts.attributes = {
          // 统计当前的商圈下有多少商铺
          include: [
            [ sequelize.literal(`(SELECT COUNT(1) FROM \`xq_store\` AS xs WHERE xs.area_id = store_area.id)`),
              'store_count' ],
          ],
        };
      }
      if (!has_store_count) {
        query_opts.raw = true;
      }
      // 1. 如果用户不存在则新增用户
      const storeareas = await StoreArea.findAll(query_opts);
      // 数据缓存
      if (!has_store_count && cacheKey && _.isArray(storeareas) && storeareas.length > 0) {
        // const seconds = 60 * 60 * 24 * 30;
        // await this.setCache(cacheKey, storeareas, seconds);
        const mdata = {};
        storeareas.forEach(area => {
          mdata[area.id] = area;
        });
        await this.hashMSet({ key: cacheKey, data: mdata });
        return ctx.message.success(await this.findAreaForRedis(queryParams));
      }
      return ctx.message.success(storeareas);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }


  /**
   * 查询已开通商圈的省份
   */
  async findProvince({hasStoreArea}) {
    const { ctx } = this;
    // 判断缓存
    let cacheKey = `${CacheAreaProvinceKey}`
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      return ctx.message.success(cacheData);
    }
    
    // const sequelize = ctx.model;
    const { StoreArea } = ctx.model;
    try {
      // 查询配置
      const query_opts = {
        // attributes:['province'], 
        // group:'province',
        raw: true,
      };

      // 1. 查询所有的商圈
      const storeareas = await StoreArea.findAll(query_opts);
      console.log('storeareas: ', storeareas);
      // 2. 组合商圈数据: [ {省份: { [商圈] } } ]
      const dataList = [];
      let tmp = null;
      storeareas.forEach((area, index) => {
        // console.log(`对比: ${area.province} != ${tmp?.province}  => `, (area.province != tmp?.province));
        if (area.province != tmp?.province) {
          if (tmp) {
            dataList.push(tmp);
          }
          tmp = { province: area.province, province_code: area.province_code };
          tmp.areas = [area];
        } else if(_.isArray(tmp.areas)){
          tmp.areas.push(area);
          if (index == storeareas.length - 1) {
            dataList.push(tmp);
          }
        }
      });

      // 数据缓存
      const seconds = 60 * 60 * 24 * 30;
      await this.setCache(cacheKey, dataList, seconds);

      return ctx.message.success(dataList);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = StoreareaService;
