'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');
const { CacheBizTimesKey, CacheStoreListKey, CacheStoreInfoKey } = require('../util/redis-key');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class SellerService extends BaseService {
  /**
   * 商户(敏感)信息修改申请
   * 提交数据将以 JSON 格式存储至审核记录表( store_change_record )中的 current_json 字段, 
   * 以便管理端审核时进行对比, 审核完成后真正进行变更;
   * @param {*} options 
   */
  async infoApply({store_id, logourl, store_name, category, area_id, address, longitude, latitude, contcat,
    seller_name, seller_phone, license, detail}) {
    const { ctx } = this;
    // 过滤无效参数, qd = query_data
    const qd = _.omitBy({ logourl, store_name, category, area_id, address, longitude, latitude, contcat,
      seller_name, seller_phone, license, detail }, _.isNil);
    const query_attributes = Object.keys(qd);
    if (query_attributes.length === 0) {
      // 申请变更的数据为空
      return ctx.message.seller.applyParamsEmpty({ store_id }, 'infoApply');
    }
    const { XqStore, StoreChangeRecord } = ctx.model;
    try {
      // 1. 查找相关商户数据
      const store = await XqStore.findOne({
        attributes: query_attributes, where: { id: store_id }, raw: true,
      });
      if(!store) return ctx.message.result.noData({ store_id });
      // 2. 提交变更申请
      const record = await StoreChangeRecord.create({
        id: ctx.uuid32, store_id, struts: 1,
        origin_json: JSON.stringify(store), 
        current_json: JSON.stringify(qd), 
      });
      return ctx.message.success(record);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 商户(非敏感)信息立即修改
   * 关于 状态 相关的修改,应在商圈管理员开设权限后方可执行
   * 2020-06-20 13:26: 添加开关店时间变更 start_time    stop_time
   * @param {*} options 
   */
  async infoUpdate({store_id, biz_struts, can_delivery, can_takeself, can_eatin, delivery_fee, meal_fee, auto_takeorder,
    start_time, stop_time, zeronorm
  }) {
    const { ctx } = this;
    // 过滤无效参数, qd = query_data
    const qd = _.omitBy({ biz_struts, can_delivery, can_takeself, can_eatin, delivery_fee, meal_fee, 
      auto_takeorder, zeronorm }, _.isNil);
    // if (Object.keys(qd).length === 0) {
    //   // 修改变更的数据为空
    //   return ctx.message.seller.applyParamsEmpty({ store_id }, 'infoUpdate');
    // }
    const { XqStore } = ctx.model;
    try {
      // 1. 查找相关商户数据
      const store = await XqStore.findOne({ where: { id: store_id }, raw: true });
      // 如果用户修改 订单使用方式, 则查看状态操作的权限
      // if (store.can_change_struts !== '1' && (can_delivery != null || can_takeself != null || can_eatin != null )) {
      //   return ctx.message.seller.noPermiss({store_id}, '缺少执行权限: can_change_struts'); // 缺乏权限
      // }
      // 如果用户修改 配送费, 则查看 配送费变更的权限
      if (store.can_set_delivery_fee !== '1' && delivery_fee != null) {
        return ctx.message.seller.noPermiss({store_id}, '缺少执行权限: can_set_delivery_fee'); // 缺乏权限
      }
      // 如果用户修改 配送费, 则查看 配送费变更的权限
      if (store.can_set_meal_fee !== '1' && meal_fee != null) {
        return ctx.message.seller.noPermiss({store_id}, '缺少执行权限: can_set_meal_fee'); // 缺乏权限
      }
      // 2. 若 "biz_struts" (营业状态) 为关闭 = '0', 则关闭自动接单选项;
      if (qd.biz_struts === '0') {
        qd.auto_takeorder = '0';
      }

      // 3. 变更商铺的营业时间, 则变更缓存 CacheBizTimesKey
      if (start_time !== undefined && start_time !== store.start_time) {
        qd.start_time = start_time;
        if (store.start_time) {
          // 若原商铺的开业时间存在, 则缓存中移除
          const times = (await this.hashGetData(CacheBizTimesKey, store.start_time)) || [];
          if (_.isArray(times)) {
            const oldIndex = times.findIndex(s => (s.store_id === store.id && s.exec === 'start'));
            if (oldIndex >= 0){
              times.splice(oldIndex, 1);
              await this.hashSetData(CacheBizTimesKey, store.start_time, times);
            }
          }
        }
        if (start_time != null && start_time !== 'null') {
          // 添加新的开店时间 至 redis缓存
          const times = (await this.hashGetData(CacheBizTimesKey, start_time)) || [];
          times.push({ store_id: store.id, area_id: store.area_id, exec: 'start' });
          await this.hashSetData(CacheBizTimesKey, start_time, times);
        }
      }
      if (stop_time !== undefined && stop_time !== store.stop_time) {
        qd.stop_time = stop_time;
        if (store.stop_time) {
          // 若原商铺的开业时间存在, 则缓存中移除
          const times = (await this.hashGetData(CacheBizTimesKey, store.stop_time)) || [];
          if (_.isArray(times)) {
            const oldIndex = times.findIndex(s => (s.store_id === store.id && s.exec === 'stop'));
            if (oldIndex >= 0){
              times.splice(oldIndex, 1);
              await this.hashSetData(CacheBizTimesKey, store.stop_time, times);
            }
          }
        }
        if (stop_time != null && stop_time !== 'null') {
          // 添加新的开店时间 至 redis缓存
          const times = (await this.hashGetData(CacheBizTimesKey, stop_time)) || [];
          times.push({ store_id: store.id, area_id: store.area_id, exec: 'stop' });
          await this.hashSetData(CacheBizTimesKey, stop_time, times);
        }
      }

      // ctx.logger.info('[商户修改信息] 修改参数: ', qd);
      // ctx.logger.info('[商户修改信息] 开关店时间缓存表: ', await this.hashGetEntries(CacheBizTimesKey));

      // 3. 如果用户不存在则新增用户
      const update_result = await XqStore.update(qd, {
        where: { id: store_id }
      });
      // 商户修改信息, 变更首屏缓存
      const cacheKey = `${CacheStoreListKey}:${store.area_id}`;
      await this.hashDeleteAll(cacheKey); // 删除首屏缓存

      // 5. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store.id}`;
      await this.delCache(cacheInfoKey);
      
      // 变更商铺主页缓存
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store.id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   // Hash 缓存保存
      //   await this.hashMSet({ key: storeInfoCacheKey, data: Object.assign(storeInfoCacheData, store) });
      // }
      
      return ctx.message.success(update_result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 添加子账号
   * @param {*} options 
   */
  async createSubAccount({store_id, username, gender, phonenum}) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      const seller = await XqSubSeller.findOne({ where: {phonenum} });
      if( seller ) {
        return ctx.message.result.repetition({store_id, username, gender, phonenum}, '创建子账户');
      }
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.create({
        id: ctx.uuid32, store_id, username, gender, phonenum, level: 'worker', struts: '1'
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 变更子账号状态
   * 操作对象级别必须为: level: 'worker'
   * @param {*} options 
   */
  async changeSubStruts({sub_id, struts}) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.update({ struts }, {
        where: { id: sub_id, level: 'worker' },
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询子账号列表
   * @param {*} options 
   */
  async findSubAccounts({store_id, struts}) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.findAll({
        where: { store_id, struts }, raw: true,
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = SellerService;
