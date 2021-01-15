'use strict';
const _ = require('lodash');
const { CacheStoreListKey, CacheStoreInfoKey, CacheBizTimesKey } = require('../../../util/redis-key');
const BaseService = require('../../base/base');

/**
 * Seller 管理
 */
class SellerService extends BaseService {

  /**
   * 创建一个新的商户
   */
  async createStore({ area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts='1', biz_struts='0', 
    can_tablesign='0', can_change_struts='0', can_delivery='0', delivery_state, can_takeself='1', can_eatin='1',
    can_set_delivery_fee='0', delivery_fee, can_set_meal_fee='0', meal_fee, priority, longitude, latitude, 
    start_time, stop_time, can_withdrawal='0', dining_id, withdrawal_ratio, zeronorm,
    printer_no }) {
    
    const { ctx } = this;
    const { XqStore, GoodsChannel, XqSubSeller } = ctx.model;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 创建商户记录
      const store = { id: ctx.uuid32, area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
        can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin, start_time, stop_time, can_withdrawal,
        dining_id, withdrawal_ratio, zeronorm,
        can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude, printer_no };
      const insert_res = await XqStore.create(store, { transaction });
      if (!insert_res) throw '商户信息添加失败: ' + contact;
      // 2. 创建默认的商户频道: 全部
      const channel = await GoodsChannel.create({
        id: ctx.uuid32,
        store_id: store.id,
        title: '全部',
        priority: 0,
      }, {transaction});
      if (!channel) throw '频道信息添加失败: ' + contact;
      // 3. 如果该商铺的状态是 "启用 && 已开店", 则更新商铺列表缓存 CacheStoreListKey: area_id
      if (struts == '1' && biz_struts == '1') {
        const cacheKey = `${CacheStoreListKey}:${area_id}`;
        // this.hashSetData(cacheKey, store.id, store); // 添加店铺至缓存
        await this.hashDeleteAll(cacheKey); // 删除首屏缓存
      }
      // 4. 根据商家预留电话, 生成店主信息 contact
      const seller = await XqSubSeller.create({
        id: ctx.uuid32,
        store_id: store.id,
        phonenum: contact,
        level: 'master',
        struts: '1',
      }, {transaction});
      if (!seller) throw '商家信息添加失败: ' + contact;
      // 5. 新增商铺的营业时间, 写入缓存 CacheBizTimesKey
      if (start_time) {
        const times = (await this.hashGetData(CacheBizTimesKey, start_time)) || [];
        times.push({ store_id: store.id, exec: 'start' });
        await this.hashSetData(CacheBizTimesKey, start_time, times);
      }
      if (stop_time) {
        const times = (await this.hashGetData(CacheBizTimesKey, stop_time)) || [];
        times.push({ store_id: store.id, exec: 'stop' });
        await this.hashSetData(CacheBizTimesKey, stop_time, times);
      }
      // 向飞鹅发送添加打印机的请求, 更新数据亦同
      // 提交事务
      await transaction.commit();
      return ctx.message.success({ store, channel});
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 修改一个新的商户
   */
  async updateStore({ store_id, area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
    can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin, 
    can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude, 
    start_time, stop_time, can_withdrawal, dining_id, withdrawal_ratio, zeronorm,
    printer_no }) {
    
    const { ctx } = this;
    const { XqStore, Goods } = ctx.model;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 查询商铺当前数据
      let store = await XqStore.findOne({ where: {id: store_id}, raw: true });
      // 2. 过滤待变更内容
      const changeEntry = _.omitBy({ area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
        can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin, can_withdrawal, dining_id,
        can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude, printer_no,
        withdrawal_ratio, zeronorm,
       }, _.isNil); // 过滤修改内容
      // 允许为 null 的数据
      if (start_time !== undefined) {
        changeEntry.start_time = start_time;
      }
      if (stop_time !== undefined) {
        changeEntry.stop_time = stop_time;
      }
      // 3. 修改商户记录
      const update_res = await XqStore.update(changeEntry, {
        where: { id: store_id }, transaction,
      });
      const affect_rows = update_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await transaction.rollback();
        return ctx.message.db.noAffectRows(changeEntry, '管理员修改一个新的商户');
      }

      // 4. 首屏缓存变更
      const cacheKey = `${CacheStoreListKey}:${store.area_id}`;
      await this.hashDeleteAll(cacheKey); // 删除首屏缓存

      // 5. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store.id}`;
      await this.delCache(cacheInfoKey);

      // 先获取: 是否移除缓存商铺 的判断
      // const isRemoveCache = (store.struts === '1' && store.biz_struts === '1' && (struts === '0' || biz_struts === '0'));
      // // 合并新旧数据, 以判断是否要将该商铺数据增至缓存
      // store = Object.assign(store, changeEntry); // 替换新的商户数据
      // // 判断:是否将商铺数据新增至缓存
      // const isAddCache = (store.struts === '1' && store.biz_struts === '1');

      // if (isRemoveCache) {
      //   // 移除缓存
      //   console.log('更新数据时,商铺缓存删除...');
      //   await this.hashDelete(cacheKey, store.id);
      // } else if(isAddCache) {
      //   // 其他可能性时, 添加|更新缓存
      //   console.log('更新数据时,商铺缓存已变化...');
      //   // 添加随机三种商品至商铺缓存
      //   store.goods = await Goods.findAll({ where: {
      //     store_id: store.id, struts: 1,
      //   }, limit: 3 });
      //   // 缓存变更
      //   await this.hashSetData(cacheKey, store.id, store); // 添加店铺至缓存
      // } else {
      //   console.log('更新数据时,未对在线缓存造成任何影响...');
      // }

      // 5. 若商铺信息页缓存存在, 则变更缓存项
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store.id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   // Hash 缓存保存
      //   await this.hashMSet({ key: storeInfoCacheKey, data: Object.assign(storeInfoCacheData, store) });
      // }

      // 4. 新增商铺的营业时间, 写入缓存 CacheBizTimesKey
      if (start_time !== undefined && start_time !== store.start_time) {
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
      // 提交事务
      await transaction.commit();
      return ctx.message.success({ store });
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 删除一个新的商户
   */
  async deleteStore({ store_id }) {
    
    const { ctx } = this;
    const { XqStore, XqSubSeller, StoreSubscibe, GoodsChannel, Goods } = ctx.model;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 查询商铺当前数据
      let store = await XqStore.findOne({ where: {id: store_id}, include: [{ model: Goods }, { model: XqSubSeller }] });
      // 2. 过滤待变更内容
      store = JSON.parse(JSON.stringify(store));
      console.log('待删除的商户: ', store);
      if (_.isArray(store.goods) && store.goods.length > 0) {
        return ctx.message.result.moreData(store, '删除商户时发现多余的商品!');
      }
      if (_.isArray(store.xq_sub_sellers) && store.xq_sub_sellers.length > 0) {
        return ctx.message.result.moreData(store, '删除商户时发现多余的商户管理员!');
      }
      // 3. 删除商户记录
      await XqStore.destroy({ where: { id: store_id }, transaction });
      // 4. 删除商户下的频道
      await GoodsChannel.destroy({ where: { store_id }, transaction });
      // 5. 删除商户的关注关系
      await StoreSubscibe.destroy({ where: { store_id }, transaction });

      // 5. 如果首屏有该商户, 则删除缓存
      const cacheKey = `${CacheStoreListKey}:${store.area_id}`;
      await this.hashDeleteAll(cacheKey); // 删除首屏缓存

      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store.id}`;
      await this.delCache(cacheInfoKey);

      // if (await this.hashExists(cacheKey, store_id)) {
      //   // 移除缓存
      //   console.log('删除商铺数据时, 首屏商铺缓存删除...');
      //   await this.hashDelete(cacheKey, store_id);
      // } else {
      //   console.log('删除商铺数据时,未对在线缓存造成任何影响...');
      // }
      // 6. 若商铺信息页缓存存在, 则变更缓存项
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   // Hash 缓存保存
      //   // await this.hashMSet({ key: storeInfoCacheKey, data: Object.assign(storeInfoCacheData, store) });
      //   await this.hashDeleteAll(storeInfoCacheKey);
      // }
      // 7. 新增商铺的营业时间, 写入缓存 CacheBizTimesKey
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
      // 提交事务
      await transaction.commit();
      return ctx.message.success({ store });
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 添加子账号
   * @param {*} options 
   */
  async createSeller({store_id, username, gender, phonenum, level}) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      const seller = await XqSubSeller.findOne({ where: {phonenum} });
      if( seller ) {
        return ctx.message.result.repetition({store_id, username, gender, phonenum}, '创建子账户时手机号码重复');
      }
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.create({
        id: ctx.uuid32, store_id, username, gender, phonenum, level, struts: '1'
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 修改商户子账号
   * @param {*} options 
   */
  async updateSeller({seller_id, username, gender, phonenum, level, struts}) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      if (phonenum) {
        const seller = await XqSubSeller.findOne({ where: { phonenum, id: {[ctx.Op.ne]: seller_id} } });
        if( seller ) {
          return ctx.message.result.repetition({seller_id, username, gender, phonenum, level, struts}, '修改商户子账户时手机号码重复');
        }
      }
      const changeEntry = _.omitBy({ username, gender, phonenum, level, struts }, _.isNil); // 过滤修改内容
      if (Object.keys(changeEntry).length === 0) {
        return ctx.message.param.miss(changeEntry, '修改商户子账户时参数缺失');
      }
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.update(changeEntry, {
        where: { id: seller_id }
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 删除商户子账号
   * @param {*} options 
   */
  async deleteSeller({ seller_id }) {
    const { ctx } = this;
    const { XqSubSeller } = ctx.model;
    try {
      // 2. 如果用户不存在则新增用户
      const result = await XqSubSeller.destroy({
        where: { id: seller_id }
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 查询管理者旗下所有商户
   */
  async findAll({ struts, testId }) {
    const { ctx } = this;
    // 获取操作用户
    const manager_id = ctx.auth?.id ?? testId;
    if(!manager_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    const { ManagerAreaRelation, StoreArea, XqStore } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const include = [{
        model: StoreArea, required: true, attributes: [],
        include: [{
          model: ManagerAreaRelation, where: { manager_id }, attributes: [],
        }]
      }];
      const result = await XqStore.findAll({ include, where: { struts }, raw: true });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async auditList({ struts, testId }) {
    const { ctx } = this;
    // 获取操作用户
    const manager_id = ctx.auth?.id ?? testId;
    if(!manager_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    const { ManagerAreaRelation, StoreArea, XqStore, StoreChangeRecord } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const include = [{
        model: XqStore, required: true, attributes: ['store_name'],
        include: [{
          model: StoreArea, required: true, attributes: [],
          include: [{
            model: ManagerAreaRelation, where: { manager_id }, attributes: [],
          }]
        }]
      }];
      const result = await StoreChangeRecord.findAll({
        attributes: ['id', 'store_id', 'struts', 'reason', 'audit_at', 'create_at'],
        include,
        where: { struts }
      });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async auditOne({ record_id }) {
    const { ctx } = this;
    const { XqStore, StoreChangeRecord } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const include = [{
        model: XqStore, required: true,
      }];
      const result = await StoreChangeRecord.findOne({ include, where: {id: record_id} });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async audit({area_id, record_id, apply_result, reason, testId}) {
    const { ctx } = this;
    // 获取操作用户
    const master_id = ctx.auth?.id ?? testId;
    if(!master_id) {
      return ctx.message.auth.noApiUser(ctx.auth);
    }
    // apply_result 参数判断, 0 拒绝 2 通过
    if (apply_result !== '0' && apply_result !== '2') {
      return ctx.message.param.invalid({ apply_result }, '审核状态必须是[0或2]');
    }
    const { XqStore, StoreChangeRecord } = ctx.model;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 修改记录状态
      const record = await StoreChangeRecord.findOne({ where: {id: record_id, struts: '1'}, raw: true });
      // 未找到审核信息
      if(!record?.store_id || !record?.current_json) {
        return ctx.message.audit.noAuditData({record_id, apply_result});
      }
      const {store_id, current_json} = record;
      await StoreChangeRecord.update({
        master_id, struts: apply_result, reason, audit_at: ctx.NOW.toDatetime()
      }, {where: {id: record_id, struts: '1'}, transaction}); // 修改记录事务
      // 2. 当 apply_result:2 (修改通过时), 修改商户信息
      let auditEntry = null; // 待修改商户内容
      if (apply_result === '2') {
        auditEntry = JSON.parse(current_json); // 待修改商户内容
        await XqStore.update(auditEntry, {
          where: {
            id: store_id
          },
          transaction,
        });
      }
      // 3. 查询首屏商户列表中是否有该商户
      const storeListCacheKey = `${CacheStoreListKey}:${area_id}`;
      const storeListEntry = await this.hashGetData(storeListCacheKey, store_id);
      if (auditEntry && storeListEntry) {
        // 缓存变更
        await this.hashSetData(storeListCacheKey, store_id, Object.assign(storeListEntry, auditEntry)); // 添加店铺至缓存
      }
      // 4. 查询商户信息页是否有该商户
      const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      if (auditEntry && Object.keys(storeInfoCacheData).length > 0) {
        // 缓存项存在
        // Hash 缓存保存
        await this.hashMSet({ key: storeInfoCacheKey, data: Object.assign(storeInfoCacheData, auditEntry) });
      }
      // 提交事务
      await transaction.commit();
      return ctx.message.success();
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }
  /**
   * 变更商户状态
   */
  // async changeStruts({ store_id, area_id, struts, biz_struts, can_tablesign, 
  //   can_change_struts, can_set_delivery_fee, can_set_meal_fee }) {
  //   const { ctx } = this;
  //   // 获取操作用户
  //   const master_id = ctx.auth?.id ?? testId;
  //   if(!master_id) {
  //     return ctx.message.auth.noApiUser(ctx.auth);
  //   }
  //   const { XqStore, StoreChangeRecord } = ctx.model;
  //   const transaction = await ctx.model.transaction(); // 事务
  //   try {
  //     const changeEntry = _.omitBy({struts, biz_struts, can_tablesign, 
  //       can_change_struts, can_set_delivery_fee, can_set_meal_fee}, _.isNil); // 过滤修改内容

  //     // 新修订: 不支持商圈统一修改
  //     // if (store_id) { // 修改某商户单例
  //       const changeKeys = Object.keys(changeEntry);
  //       // 查询商户原始状态
  //       const storeEntry = await XqStore.findOne({ where: { id: store_id }, attributes: changeKeys, raw: true });
  //       // 1. 修改商户状态
  //       await XqStore.update(changeEntry, {
  //         where: { id: store_id }, transaction,
  //       });
  //       // 2. 添加修改记录
  //       await StoreChangeRecord.create({
  //         id: ctx.uuid32, store_id, master_id,
  //         origin_json: JSON.stringify(storeEntry),
  //         current_json: JSON.stringify(changeEntry),
  //         struts: '3', reason: '修改商户状态', audit_at: ctx.NOW.toDatetime()
  //       }, {transaction});
  //       // 3. 查询首屏商户列表中是否有该商户
  //       const storeListCacheKey = `${CacheStoreListKey}:${area_id}`;
  //       const storeListEntry = await this.hashGetData(storeListCacheKey, store_id);
  //       if (Object.keys(storeEntry).length > 0 && storeListEntry) {
  //         // 缓存变更
  //         await this.hashSetData(storeListCacheKey, store_id, Object.assign(storeListEntry, auditEntry)); // 添加店铺至缓存
  //       }
  //       // 4. 查询商户信息页是否有该商户
  //       const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
  //       const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
  //       if (auditEntry && Object.keys(storeInfoCacheData).length > 0) {
  //         // 缓存项存在
  //         // Hash 缓存保存
  //         await this.hashMSet({ key: storeInfoCacheKey, data: Object.assign(storeInfoCacheData, auditEntry) });
  //       }
  //     // } else if(area_id) { // 批量修改商圈下的商户状态
  //     //   // 1. 修改商户状态
  //     //   await XqStore.update(changeEntry, { where: { area_id }, transaction });
  //     // } else {
  //     //   throw new Error('[changeStruts] area_id and store_id is not found!');
  //     // }

  //     // 提交事务
  //     await transaction.commit();
  //     return ctx.message.success(changeEntry, '修改商户状态成功');
  //   } catch (err) {
  //     await transaction.rollback();
  //     return ctx.message.exception(err);
  //   }
  // }

  async addPrint(citycode) {
    const { ctx } = this;
    // const { District } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      // const districts = await District.findAll({ where: { citycode } });
      return ctx.message.success();
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async testPrint(citycode) {
    const { ctx } = this;
    // const { District } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      // const districts = await District.findAll({ where: { citycode } });
      return ctx.message.success();
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async removePrint(citycode) {
    const { ctx } = this;
    // const { District } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      // const districts = await District.findAll({ where: { citycode } });
      return ctx.message.success();
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
}

module.exports = SellerService;
