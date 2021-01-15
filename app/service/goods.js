'use strict';
const _ = require('lodash');
const { CacheStoreListKey, CacheStoreInfoKey } = require('../util/redis-key');
const BaseService = require('./base/base');

/**
 * 商品频道 管理
 */
class GoodsService extends BaseService {
  /**
   * 新增商品
   */
  async create({ area_id, store_id, channel_id, goods_pic, title, good_type, price, glimit, discount_price, priority, detail
    ,meal_fee, hot='0', day_amount, stock_count, auto_fill_stock='0'
  }) {
    const {ctx} = this;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { Goods, GoodsChannel } = ctx.model;
      // 1. 新增商品
      const new_goods = {
        id: ctx.uuid32, store_id, channel_id, goods_pic, title, good_type, price, glimit, discount_price, priority, detail,
        meal_fee, hot, day_amount, stock_count, auto_fill_stock
      };
      const result = await Goods.create(new_goods);
      // 2. 查询当前商铺的商品总数, 如果小于等于3, 则将商品写入商品列表缓存
      const goods_count = await Goods.count({ where: {store_id} }); // 获取商家的商品总数
      if (goods_count <= 3) {
        const storeListKey = `${CacheStoreListKey}:${area_id}`;
        if (await this.hashExists(storeListKey, store_id)) {
          const store = await this.hashGetData(storeListKey, store_id);
          if (!_.isArray(store.goods)) {
            store.goods = [];
          }
          store.goods.push(new_goods);
          await this.hashSetData(storeListKey, store_id, store); // 添加店铺至缓存
        }
      }
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);

      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 修改商品频道
   */
  async update({ area_id, goods_id, store_id, channel_id, goods_pic, title, good_type, price, glimit, 
    discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock }) {
    const {ctx} = this;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { Goods, GoodsChannel, XqStore } = ctx.model;
      // 1. 该操作必须在关店时进行?
      const store = await XqStore.findOne({ attributes: ['biz_struts'], where: { id: store_id } });
      if(store.biz_struts !== '0') {
        return ctx.message.goods.mustStopBiz({goods_id, store_id, channel_id}, '修改商品');
      }
      // 2. 查询商品的原始频道id
      // let origin_goods = await Goods.findOne({ where: {id: goods_id}, include:[{model: GoodsChannel}] });
      // origin_goods = JSON.parse(JSON.stringify(origin_goods));
      // const origin_channel = origin_goods.goods_channel;
      // 3. 保存商品数据
      const saveData = _.omitBy({channel_id, goods_pic, title, good_type, price, glimit, 
        discount_price, priority, detail, meal_fee, hot, day_amount, stock_count, auto_fill_stock}, _.isNil);
      const result = await Goods.update(saveData, {
        where: { id: goods_id }
      });
      // 4. 试图变更商铺列表中缓存的商品预览数据
      const storeListKey = `${CacheStoreListKey}:${area_id}`;
      if (await this.hashExists(storeListKey, store_id)) {
        const store = await this.hashGetData(storeListKey, store_id);
        if (_.isArray(store.goods)) {
          for (let i = 0; i < store.goods.length; i++) {
            const item = store.goods[i];
            if (item.id === goods_id) {
              store.goods[i] = Object.assign(store.goods[i], saveData);
              break;
            }
          }
        }
        await this.hashSetData(storeListKey, store_id, store); // 添加店铺至缓存
      }
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);

      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除商品数据
   */
  async delete({ area_id, channel_id, goods_id, store_id }) {
    const {ctx} = this;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      const { Goods, XqStore } = ctx.model;
      // 1. 该操作必须在关店时进行?
      const store = await XqStore.findOne({ attributes: ['biz_struts'], where: { id: store_id } });
      if(store.biz_struts !== '0') {
        return ctx.message.goods.mustStopBiz({goods_id, store_id}, '删除商品');
      }
      // 2. 删除商品数据
      const result = await Goods.destroy({ where: { id: goods_id } });
      // 4. 试图变更商铺列表中缓存的商品预览数据
      const storeListKey = `${CacheStoreListKey}:${area_id}`;
      if (await this.hashExists(storeListKey, store_id)) {
        const storeCache = await this.hashGetData(storeListKey, store_id);
        storeCache.goods = await Goods.findAll({ where: {store_id}, limit: 3, raw: true });
        await this.hashSetData(storeListKey, store_id, storeCache); // 添加店铺至缓存
      }
      
      // 6. 删除商户主页缓存
      const cacheInfoKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.delCache(cacheInfoKey);

      // 提交事务
      await transaction.commit();
      return ctx.message.success(result);
    } catch (error) {
      await transaction.rollback();
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询商品频道信息
   */
  async find({ goods_id }) {
    const {ctx} = this;
    try {
      const { Goods,GoodsType } = ctx.model;
      const result = await Goods.findOne({ where: { id: goods_id }, include: [{model: GoodsType}] });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询商品频道列表
   * 排序方式{price_desc: ‘价格倒序’,price_asc: ‘价格正序’,
   * amount_desc: ‘销量倒序’, amount_asc: ‘销量正序’, create_desc: '创建倒序', create_asc: '创建正序'}
   * @param {String} store_id 商户id
   * @param {String} area_id 商圈id
   * @param {String} channel_id 频道id
   * @param {String} keyword 关键字
   * @param {String} sort 排序方式
   * @param {Number} pageIndex 页码
   * @param {Boolean} hasStore 是否包含商户信息
   */
  async findAll({ store_id, area_id, channel_id, keyword, sort, pageIndex = 1, hasStore }) {
    const {ctx} = this;
    try {
      const { Goods, GoodsType, XqStore, StoreArea } = ctx.model;
      // 查询条件
      const whereby = {};
      if (store_id) whereby.store_id = store_id;
      if (channel_id) whereby.channel_id = channel_id;
      if (keyword) whereby.title = {[ctx.Op.like]: `%${keyword}%`};
      // 关联关系
      const include = [{model: GoodsType}];
      if (hasStore && !area_id) include.push({ model: XqStore }); //if (area_id) whereby.area_id = area_id;
      else if (hasStore && area_id) {
        include.push({ model: XqStore, required: true, include: [{ model: StoreArea, where: {id: area_id}}] });
      } else if (!hasStore && area_id) {
        include.push({ model: XqStore, required: true, attributes:[], include: [{ model: StoreArea, attributes:[], where: {id: area_id}}] });
      }
      // 排序关系
      const orderby = [];
      if (sort === 'price_desc') orderby.push(['price', 'DESC']);
      if (sort === 'price_asc') orderby.push(['price', 'ASC']);
      if (sort === 'amount_desc') orderby.push(['amount', 'DESC']);
      if (sort === 'amount_asc') orderby.push(['amount', 'ASC']);
      if (sort === 'create_desc') orderby.push(['create_at', 'DESC']);
      if (sort === 'create_asc') orderby.push(['create_at', 'ASC']);
      // 分页
      const limit = 20;
      const offset = (pageIndex - 1) * limit;
      // 查询
      const result = await Goods.findAll({
        where: whereby, include, order: orderby,
        limit, offset,
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 随机点餐
   * @param {*} param0 
   */
  async randomAll({ area_id }) {
    const {ctx} = this;
    const sequelize = ctx.model
    const {GoodsType, Goods, XqStore} = sequelize;

    try {
      // 后续将增加早餐时段只出现早餐的功能
      const goodsList = await Goods.findAll({
        attributes: ['id', 'store_id', 'goods_pic', 'title', 'price', 'discount_price', 'glimit', 'amount', 'detail', 'food_count'],
        where: {struts: 1},
        include: [{
          model: GoodsType, where: { parent_code: 'staple' },
          attributes: ['name'],
        }, {
          model: XqStore, where: {struts: '1', biz_struts: '1', area_id: area_id},
          attributes: ['logourl', 'store_name', 'address'],
        }], // 筛选主食
        order: sequelize.fn('RAND'),
        limit: 20,
      });
  
      // const rawList = JSON.parse(JSON.stringify(goodsList));
      return ctx.message.success(goodsList);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = GoodsService;
