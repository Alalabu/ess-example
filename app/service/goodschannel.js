'use strict';
const _ = require('lodash');
const { CacheStoreInfoKey } = require('../util/redis-key');
const BaseService = require('./base/base');

/**
 * 商品频道 管理
 */
class GoodschannelService extends BaseService {
  /**
   * 新增商品频道
   */
  async create({ store_id, title, priority }) {
    const {ctx} = this;
    try {
      const { GoodsChannel } = ctx.model;
      // 1. 新增商品频道
      const channel = {
        id: ctx.uuid32, store_id, title, priority
      };
      const result = await GoodsChannel.create(channel);
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);
      // 2. 变更商铺信息中的频道缓存
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   const goods_channels = (await this.hashGetData(storeInfoCacheKey, 'goods_channels')) || [];
      //   channel.goods_count = 0;
      //   goods_channels.push(channel);
      //   goods_channels.sort((a,b) => b.priority - a.priority); // 频道排序
      //   await this.hashSetData(storeInfoCacheKey, 'goods_channels', goods_channels);
      // }
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 修改商品频道
   */
  async update({ channel_id, store_id, title, priority }) {
    const {ctx} = this;
    try {
      const { GoodsChannel } = ctx.model;
      const saveData = _.omitBy({title, priority}, _.isNil);
      const result = await GoodsChannel.update(saveData, {
        where: { id: channel_id }
      });
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);
      // 2. 变更商铺信息中的频道缓存
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   const goods_channels = (await this.hashGetData(storeInfoCacheKey, 'goods_channels')) || [];
      //   goods_channels.forEach( ch => { // 修改缓存列表中的频道部分
      //     if (ch.id === channel_id)
      //       ch = Object.assign(ch, saveData);
      //   });
      //   goods_channels.sort((a,b) => b.priority - a.priority);
      //   // channel.goods_count = 0;
      //   // goods_channels.push(channel);
      //   await this.hashSetData(storeInfoCacheKey, 'goods_channels', goods_channels);
      // }
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除商品频道
   */
  async delete({ store_id, channel_id }) {
    const {ctx} = this;
    try {
      const { GoodsChannel, Goods } = ctx.model;
      // 1. 若频道下有商品, 则无法删除频道
      const goods_count = await Goods.count({ where: { channel_id } });
      if( goods_count > 0 ) return ctx.message.channel.hasGoodsNotDelete({ channel_id });
      // 2. 若此频道是该商铺下唯一的频道, 则不能删除, 至少保证有一个频道
      const channels_count = await GoodsChannel.count({ where: { store_id } });
      if( channels_count === 1 ) return ctx.message.channel.mustHasOne({ channel_id });
      // 3. 执行频道删除
      const result = await GoodsChannel.destroy({ where: { id: channel_id } });
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);
      // 4. 变更商铺信息中的频道缓存
      // const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      // const storeInfoCacheData = await this.hashGetEntries(storeInfoCacheKey);
      // if (Object.keys(storeInfoCacheData).length > 0) {
      //   // 缓存项存在
      //   const goods_channels = (await this.hashGetData(storeInfoCacheKey, 'goods_channels')) || [];
      //   let chIndex = -1;
      //   for (let i = 0; i < goods_channels.length; i++) {
      //     if (goods_channels[i].id === channel_id) {
      //       chIndex = i;
      //       break;
      //     }
      //   }
      //   if (chIndex > -1) {
      //     goods_channels.splice(chIndex, 1);
      //     await this.hashSetData(storeInfoCacheKey, 'goods_channels', goods_channels);
      //   }
      // }
      // 返回数据
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询商品频道信息
   */
  async find({ channel_id, has_goods }) {
    const {ctx} = this;
    try {
      const { GoodsChannel, Goods } = ctx.model;
      const include = [];
      if (has_goods) include.push({ model: Goods });
      const result = await GoodsChannel.findOne({
        where: { id: channel_id },
        include,
        order: [['priority', 'DESC']],
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询商品频道列表
   */
  async findAll({ store_id, has_goods }) {
    const {ctx} = this;
    try {
      const { GoodsChannel, Goods } = ctx.model;
      const include = [];
      if (has_goods) include.push({ model: Goods })
      const orderby = [['priority', 'DESC']];
      const result = await GoodsChannel.findAll({ where: { store_id }, include, order: orderby });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = GoodschannelService;
