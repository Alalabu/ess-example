'use strict';
const _ = require('lodash');
const { CacheAreaListKey, CacheAreaProvinceKey } = require('../../../util/redis-key');
const BaseService = require('../../base/base');

/**
 * 商圈管理
 */
class SaareaService extends BaseService {

  /**
   * 创建新的商圈
   */
  async create({merchant_id, city, city_code, province, province_code, receivable_way,
    name, title, longitude, latitude, parent_code, unify_delivery_fee, unify_meal_fee}) {
    const { ctx } = this;
    // 获取操作用户
    // const manager_id = ctx.auth?.id;
    // if(!manager_id) {
    //   return ctx.message.auth.noApiUser(ctx.auth);
    // }
    // const transaction = await ctx.model.transaction(); // 事务
    const { StoreArea } = ctx.model;
    try {
      // 1. 添加商圈
      const area = await StoreArea.create({
        id: ctx.uuid32, merchant_id, city, city_code, province, province_code, receivable_way,
        name, title, longitude, latitude, parent_code, unify_delivery_fee, unify_meal_fee
      });
      // 2. 添加商圈管理员关系
      // await ManagerAreaRelation.create({
      //   id: ctx.uuid32, manager_id: manager_id, area_id: area.id,
      // }, { transaction });
      // await transaction.commit();

      // 5. 管理商圈缓存
      const cacheKey = `${CacheAreaListKey}`;
      const areaIsExists = await this.hashExists(cacheKey, area.id);
      if (!areaIsExists) {
        // 移除缓存
        console.log('删除商铺数据时, 首屏商铺缓存删除...');
        // await this.hashDelete(cacheKey, store_id);
        await this.hashSetData(cacheKey, area.id, area);
      }
      // 6. 删除 已开通商圈的省份 的缓存
      await this.delCache(CacheAreaProvinceKey);

      return ctx.message.success(area);
    } catch (err) {
      // await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 修改已有商圈数据
   * @param {*} param0 
   */
  async update({ area_id, merchant_id, city, city_code, province, province_code, receivable_way,
    name, title, longitude, latitude, parent_code, unify_delivery_fee, unify_meal_fee }) {
    const { ctx } = this;
    // 获取操作用户
    // const manager_id = ctx.auth?.id;
    // if(!manager_id) {
    //   return ctx.message.auth.noApiUser(ctx.auth);
    // }
    const { StoreArea } = ctx.model;
    try {
      // 1. 查询支付ID是否存在
      
      // 2. 修改商圈信息
      const updateEntry = _.omitBy({merchant_id, city, city_code, province, province_code, receivable_way,
        name, title, longitude, latitude, parent_code, unify_delivery_fee, unify_meal_fee}, _.isNil); // 过滤更新内容
      // 1. 如果用户不存在则新增用户
      const result = await StoreArea.update(updateEntry, {
        where: { id: area_id }
      });
      // 5. 管理商圈缓存
      const cacheKey = `${CacheAreaListKey}`;
      const cacheData = await this.hashGetData(cacheKey, area_id);
      await this.hashSetData(cacheKey, area_id, Object.assign(cacheData, updateEntry));
      // 6. 删除 已开通商圈的省份 的缓存
      await this.delCache(CacheAreaProvinceKey);

      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 删除商圈
   * @param {*} param0 
   */
  async delete({ area_id }) {
    const { ctx } = this;
    // 获取操作用户
    // const manager_id = ctx.auth?.id;
    // if(!manager_id) {
    //   return ctx.message.auth.noApiUser(ctx.auth);
    // }
    const { StoreArea } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await StoreArea.destroy({ where: { id: area_id } });
      // 5. 管理商圈缓存
      const cacheKey = `${CacheAreaListKey}`;
      const areaIsExists = await this.hashExists(cacheKey, area_id);
      if (areaIsExists) {
        // 移除缓存
        // console.log('删除商铺数据时, 首屏商铺缓存删除...');
        await this.hashDelete(cacheKey, area_id);
      }
      // 6. 删除 已开通商圈的省份 的缓存
      await this.delCache(CacheAreaProvinceKey);
      
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = SaareaService;
