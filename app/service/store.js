'use strict';
const { Calendar, CalendarTypes } = require('calendar2');
const _ = require('lodash');
const { CacheStoreListKey, CacheStoreInfoKey } = require('../util/redis-key');
const BaseService = require('./base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class StoreService extends BaseService {
  /**
   * 查询商户单例
   */
  async find({store_id, has_channel=false, has_goods=false, has_tags=false, has_order_tags=false,
    
  }) {
    const { ctx } = this;
    // let cacheKey = null;
    // // 判断缓存
    // if (has_channel && has_goods) {
    //   // 频道和商品都查询时, 缓存记录
    //   // 主要应对 查询单店铺 场景
    //   // 商品一次性查完
    //   cacheKey = `${CacheStoreInfoKey}:${store_id}`; // 表示某商户, 字段应包含: 基本信息、频道、商品
    //   // const cacheData = await this.getCache(cacheKey);
    //   const cacheData = await this.hashGetEntries(cacheKey);
    //   // console.log('缓存的商户信息: ', cacheData, await this.hashExists(cacheKey));
    //   if (Object.keys(cacheData).length > 0) {
    //     console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}`);
    //     return ctx.message.success(cacheData);
    //   }
    // }
    
    // 参数判断
    has_channel = (has_channel === 'true' || has_channel === true) ? true : false;
    has_goods = (has_goods === 'true' || has_goods === true) ? true : false;
    has_tags = (has_tags === 'true' || has_tags === true) ? true : false;
    has_order_tags = (has_order_tags === 'true' || has_order_tags === true) ? true : false;
    // hasCommentCount = (hasCommentCount === 'true' || hasCommentCount === true) ? true : false;
    // hasCommentList = (hasCommentList === 'true' || hasCommentList === true) ? true : false;

    // 判断缓存
    // let cacheKey = null;
    // if (has_channel && has_goods) {
    //   cacheKey = `${CacheStoreInfoKey}:${store_id}`; // 表示某商户, 字段应包含: 基本信息、频道、商品
    //   const cacheData = await this.getCache(cacheKey);
    //   if (cacheData) {
    //     console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}`);
    //     return ctx.message.success(cacheData);
    //   }
    // }

    const { XqStore, GoodsChannel, Goods, StoreTags, StoreTagsOrder, GoodsType, GoodsGroup, GoodsSpec, TicketInfo } = ctx.model;
    try {
      // 1. 查询商户信息
      const include = [];
      if(has_channel && !has_goods) {
        include.push({ model: GoodsChannel });
      }else if(has_channel && has_goods) {
        include.push({ model: GoodsChannel, include:[{ 
          model: Goods, include: [
            { model: GoodsType }, 
            // { model: GoodsGroup }, // 商品分组
            { model: GoodsSpec, attributes: ['title'] }, // 商品规格
          ] 
        }] });
      }
      // 包含商户类别下的订单标签
      if (has_order_tags) {
        include.push({ model: StoreTags, include: [{ model: StoreTagsOrder }] });
      }
      // 包含商户类别下关联, 优先级小于包含订单标签
      else if (has_tags) {
        include.push({ model: StoreTags });
      }
      // 加载商铺优惠券数据
      const today = (new Calendar()).toDate();
      include.push({
        model: TicketInfo, 
        attributes: ['id', 'issue', 'fee_max', 'fee_offset', 'title', 'period_begin', 'period_end'],
        required: false,
        where: {
          period_begin: {[ctx.Op.lte]: today},
          period_end: {[ctx.Op.gte]: today},
          struts: '1',
        },
      });
      // 查询参数
      const whereby = { id: store_id };
      const query_data = { where: whereby, include };
      // 关于字段的筛选
      // if (hasCommentCount) {
      //   query_data.attributes = {
      //     include = [
      //       [ sequelize.literal(`(SELECT COUNT(1) FROM \`order_comment\` AS oc WHERE oc.store_id = xq_store.id)`),
      //         'comm_count' ],
      //     ],
      //   };
      // }
      
      let store = await XqStore.findOne(query_data);
      store = JSON.parse(JSON.stringify(store));
      // console.log('返回的商铺数据 01: ', store);
      // 后置处理: 子数据集排序
      if(store){
        if(has_channel && !has_goods) {
          store.goods_channels.sort((a, b) => b.priority - a.priority);
        }else if(has_channel && has_goods) {
          // 数据排序
          if (store.goods_channels) {
            store.goods_channels.sort((a, b) => b.priority - a.priority);
            // store.goods_channels.goods_count = store.goods_channels.goods?.length || 0; // 频道包含商品数量
            store.goodsList = [];
            store.goods_channels.forEach(ch => {
              // 标注频道的商品数量
              ch.goods_count = ch.goods?.length || 0; // 频道包含商品数量
              // 如果频道下的商品不存在或者非数组, 则赋予默认值
              if (!_.isArray(ch.goods)) {
                ch.goods = [];
              }
              // 尝试合并 同组 的商品
              const temp_goods = []; // 初始化商品组
              const group_map = {}; // 初始化分组对象
              // 遍历频道下商品
              for (let x = 0; x < ch.goods.length; x++) {
                const g = ch.goods[x];
                // 如果商品有更多规格, 则简化规格标识
                if (_.isArray(g.goods_specs) && g.goods_specs.length > 0) {
                  g.goods_specs = g.goods_specs.map((s, i) => {
                    return Object.assign(s, {enabled: !(i), pay_count: 0, gtitle: `${g.title} (${s.title})`});
                  });
                  g.goods_fouce_specs = g.goods_specs[0]; // 默认选中的规格
                  g.has_specs = '1'; // 商品是否拥有规格数据
                }
                // 判断分组情况
                if (g.group_id && !group_map[g.group_id]) {
                  // 商品存在分组, 但尚未记录分组数据
                  group_map[g.group_id] = g;
                  if (g.goods_group) {
                    // 初始化商品的分组名称
                    g.group_title = g.goods_group.title;
                  } else {
                    g.group_title = g.title;
                  }
                  g.group = [_.cloneDeep(g)];
                  // 商品添加频道序号
                  if(g.ch_priority == null) g.ch_priority = ch.priority;
                  temp_goods.push(_.omitBy(g, _.isNil));

                } else if (g.group_id && group_map[g.group_id]) {
                  // 如果商品存在分组, 并且已经记录分组数据, 则将本商品添加入分组数据
                  const group_goods = group_map[g.group_id];
                  if (_.isArray(group_goods.group)) {
                    group_goods.group.push(g);
                  }
                  // 在商品频道中数量减一
                  ch.goods_count--;
                } else {
                  // 商品添加频道序号
                  if(g.ch_priority == null) g.ch_priority = ch.priority;
                  temp_goods.push(_.omitBy(g, _.isNil));
                }

              }

              ch.goods = temp_goods;

              // console.log('当前频道的商品::::: ', ch.goods);

              // ch.goods = ch.goods.map( g => {
              //   if(g.ch_priority == null) g.ch_priority = ch.priority;
              //   return _.omitBy(g, _.isNil);
              // });

              // 商品排序
              ch.goods.sort((a, b) => {
                // if(a.ch_priority == null) a.ch_priority = ch.priority;
                // if(b.ch_priority == null) b.ch_priority = ch.priority;
                // return a.priority - b.priority;
                return (b.ch_priority * 300 + b.priority) - (a.ch_priority * 300 + a.priority);
              });
              if (_.isArray(ch.goods)) {
                // 合并频道中的商品数据
                store.goodsList = store.goodsList.concat(ch.goods);
                // 删除频道中的商品数据
                delete ch.goods;
              }
            });

            // 备份
            // store.goods_channels.forEach(ch => {
            //   // 标注频道的商品数量
            //   ch.goods_count = ch.goods?.length || 0; // 频道包含商品数量
            //   // 商品添加频道序号
            //   ch.goods = ch.goods.map( g => {
            //     if(g.ch_priority == null) g.ch_priority = ch.priority;
            //     return _.omitBy(g, _.isNil);
            //   });
            //   // 商品排序
            //   ch.goods.sort((a, b) => {
            //     // if(a.ch_priority == null) a.ch_priority = ch.priority;
            //     // if(b.ch_priority == null) b.ch_priority = ch.priority;
            //     // return a.priority - b.priority;
            //     return (b.ch_priority * 300 + b.priority) - (a.ch_priority * 300 + a.priority);
            //   });
            //   if (_.isArray(ch.goods)) {
            //     // 合并频道中的商品数据
            //     store.goodsList = store.goodsList.concat(ch.goods);
            //     // 删除频道中的商品数据
            //     delete ch.goods;
            //   }
            // });

          }
        }
      }

      // 数据缓存
      // if (has_channel && has_goods && cacheKey) {
      //   // Hash缓存
      //   const seconds = 60 * 60 * 3 * 1;
      //   await this.setCache(cacheKey, store, seconds); //hashMSet({ key: cacheKey, data: store });
      // }
      console.log('返回的商铺数据 02: ', store);
      return ctx.message.success(store);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
  /**
   * 查询商户列表
   * 主要用于用户端/管理端查询
   * @param {String} area_id 商圈id
   * @param {String} city_code 城市id
   * @param {String} keyword 搜索关键字(商品)
   * @param {Number} goods_limit 包含商户的部分商品数量, 默认 0: 商户不包含任何商品数据
   * @param {Number} longitude 经度
   * @param {Number} latitude 维度
   * @param {String} sort 排序方式: {'distance_asc': '距离最近'}
   * @param {Number} pageIndex 页码
   * @param {String} struts 商家状态( 1: 正常 0: 禁用 ),由管理员变更
   * @param {String} biz_struts 营业状态(1:营业 0:歇业)
   * @param {String} can_delivery 是否支持外派, 0 不支持 1 支持
   * @param {String} can_takeself 是否支持自取, 0 不支持 1 支持
   * @param {String} can_eatin 是否支持堂食, 0 不支持 1 支持
   * @param {String} can_tablesign 是否可以管理桌签 (0 否 1 是)
   * 
   * @member 缓存建议
   *  - 对 seller/info/findAll?area_id&pageIndex=[1,2,3,4,5]&goods_limit=3&struts=1&biz_struts=1
   *    进行7*24h数据缓存,商家状态调整时(上架/下架)手动变更缓存;
   *  x 对seller/info/findAll?area_id&keyword&pageIndex=[1,2,3]进行8h数据缓存;
   */
  async findAll({ area_id, city_code, keyword, goods_limit, pageIndex = 1, pageLimit = 10,
    longitude, latitude, sort, good_type, dining_id, hasDining,
    struts, biz_struts, can_delivery, can_takeself, can_eatin, can_tablesign
  }) {
    const { ctx } = this;
    // 过滤空的 食品类型数组
    if (Array.isArray(good_type) && good_type.length === 0) {
      good_type = null;
    }
    // 过滤无效参数, qd = query_data
    const qd = _.omitBy({ area_id, city_code, keyword, goods_limit, longitude, latitude, sort, pageIndex,
      struts, biz_struts, can_delivery, can_takeself, can_eatin, can_tablesign, good_type, dining_id, hasDining,
    }, _.isNil);
    const qdKeys = Object.keys(qd);
    let cacheKey = null;
    let timerKey = null; // 列表定时器

    // console.log('qdKeys: ',qdKeys);
    // console.log('缓存条件 good_type: ', good_type, typeof good_type, Boolean(good_type));
    // console.log('缓存条件: ', qdKeys.length === 5, qdKeys.length );
    // console.log('缓存条件: ', area_id);
    // console.log('缓存条件: ', pageIndex == 1, pageIndex);
    // console.log('缓存条件: ', goods_limit == 3, goods_limit);
    // console.log('缓存条件: ', struts == 1, struts);
    // console.log('缓存条件: ', biz_struts == 1, biz_struts);
    if(qdKeys.length === 5 && area_id 
      // && pageIndex > 0 && pageIndex <= 5 
      && pageIndex == 1
      && goods_limit == 3 
      && struts == 1 
      // && biz_struts == 1
      ) {
      // // 满足首屏查询条件: seller/info/findAll?area_id&pageIndex=[1,2,3,4,5]&goods_limit=3&struts=1&biz_struts=1
      // cacheKey = `seller.store.list:area_id=${area_id}&pageIndex=${pageIndex}&goods_limit=3&struts=1&biz_struts=1`;
      // // 判断缓存
      // const cacheData = await this.getCache(cacheKey);
      // if (cacheData) {
      //   console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}`);
      //   return ctx.message.success(cacheData);
      // }

      // 获取缓存数据
      cacheKey = `${CacheStoreListKey}:${area_id}`;
      timerKey = `cache_store_list_timer:${area_id}`;

      const cacheList = await this.hashGetValues(cacheKey);
      const cacheTimer = await this.getCache(timerKey);
      // console.log(`[Redis cacheData] 正准备获取缓存: `, cacheList);
      if ( cacheTimer && _.isArray(cacheList) && cacheList.length > 0) {
        console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}`);
        // 数据存在, 排序 biz_struts > priority
        // b.priority - a.priority
        cacheList.sort((a,b) => {
          if (a.biz_struts !== b.biz_struts) return (Number(b.biz_struts) - Number(a.biz_struts));
          return (Number(b.priority) - Number(a.priority));
        });
        // 返回数据
        return ctx.message.success(cacheList);
      }
    }
    
    const { XqStore, Goods, StoreArea, GoodsType, StoreDining, TicketInfo } = ctx.model;
    try {
      // 查询配置
      const query_options = {};
      // 查询条件
      const whereby = {};
      if(area_id) whereby.area_id = area_id; // 添加 商圈条件
      if(struts) whereby.struts = struts; // 添加 商家状态( 1: 正常 0: 禁用 )
      // if(biz_struts) whereby.biz_struts = biz_struts; // 添加 营业状态 (1:营业 0:歇业)
      if(can_delivery) whereby.can_delivery = can_delivery; // 是否支持外派
      if(can_takeself) whereby.can_takeself = can_takeself; // 是否支持自取
      if(can_eatin) whereby.can_eatin = can_eatin; // 添加 是否支持堂食
      if(can_tablesign) whereby.can_tablesign = can_tablesign; // 添加 是否可以管理桌签
      if (dining_id) whereby.dining_id = dining_id; // 添加 餐厅过滤条件
      query_options.where = whereby;
      // 关联关系
      const include = [];
      // 添加 city_code(城市) 关联条件
      if (city_code) {
        include.push({ model: StoreArea, where: {city_code: city_code} });
      }
      // 商品查询的关联条件
      if(keyword && goods_limit > 0) { // keyword 优先级为: 1
        include.push({ 
          model: Goods,
          // separate: true, limit: Number(goods_limit),
          attributes: ['id', 'title', 'goods_pic', 'hot', 'price', 'discount_price', 'glimit', 'amount'],
          where: { struts: 1, title: {[ctx.Op.like]: `%${keyword}%`} },
        });
        // query_options.subQuery = false;
      } else if(keyword && goods_limit == 0) { // keyword 优先级为: 1
        include.push({
          model: Goods, where: { struts: 1, title: {[ctx.Op.like]: `%${keyword}%`} },
          attributes: ['id', 'title', 'goods_pic', 'hot', 'price', 'discount_price', 'glimit', 'amount'],
        });
        // query_options.subQuery = false;
      } else if (good_type && goods_limit > 0) {
        if (good_type && typeof good_type === 'string') {
          good_type = good_type.split(',');
        }
        if (Array.isArray(good_type) && good_type.length > 0) {
          include.push({ 
            model: Goods, where: {
              good_type: {[ctx.Op.in]: good_type}, 
              struts: 1
            },
            attributes: ['id', 'title', 'goods_pic', 'hot', 'price', 'discount_price', 'glimit', 'amount'],
          });
        } else {
          console.log('======= good_type : ', good_type);
        }
        // query_options.subQuery = false;
      } else if (goods_limit > 0) {
        // include.push({
        //   model: Goods, separate: true, limit: Number(goods_limit),
        //   attributes: ['id', 'title', 'goods_pic', 'price', 'discount_price', 'glimit', 'amount'],
        // });
        // query_options.subQuery = false;
        include.push({ 
          model: Goods, where: { struts: 1 },
          attributes: ['id', 'title', 'goods_pic', 'hot', 'price', 'discount_price', 'glimit', 'amount'],
        });
      }
      // 加载商铺优惠券数据
      const today = (new Calendar()).toDate();
      include.push({
        model: TicketInfo, 
        attributes: ['fee_max', 'fee_offset'],
        required: false,
        where: {
          period_begin: {[ctx.Op.lte]: today},
          period_end: {[ctx.Op.gte]: today},
          struts: '1',
        },
      });
      // 加载餐厅数据关联
      if (hasDining === true || hasDining === 'true') {
        include.push({ 
          model: StoreDining, attributes: ['id', 'name'],
        });
      }
      query_options.include = include;
      // 排序
      const orderby = [['biz_struts', 'DESC'], ['priority', 'DESC'], ['create_at', 'DESC']];
      query_options.order = orderby;
      // 分页
      pageLimit = Number(pageLimit);
      if (pageLimit && _.isNumber(pageLimit)) {
        query_options.limit = (pageLimit < 1 || pageLimit > 100) ? 20 : pageLimit;
      } else {
        query_options.limit = 20;
      }
      query_options.offset = (pageIndex - 1) * query_options.limit;
      // 1. 如果用户不存在则新增用户
      let stores = await XqStore.findAll(query_options);
      // console.log('缓存资格: ', (cacheKey && qdKeys.length === 5 && area_id &&pageIndex == 1 &&goods_limit == 3 &&struts == 1 && biz_struts == 1 && _.isArray(stores) && stores.length > 0),
      //   {cacheKey, area_id, pageIndex, goods_limit, struts, biz_struts, store_len: stores.length, qdKeys_len: qdKeys.length});
      
      // 如果是关键字查询, 筛选查询内容
      // if((keyword || good_type) && goods_limit > 0) {
      if(goods_limit > 0) {
        // stores = JSON.parse(JSON.stringify(stores));
        // console.log('关键字搜索集合: ', stores);
        stores.forEach( st => {
          if (_.isArray(st.goods) && !keyword && !good_type) {
            st.goods.sort((a,b)=>b.hot-a.hot); // 普通搜索时才会找热门排序
          }
          if (_.isArray(st.goods) && st.goods.length > goods_limit) {
            st.goods.length = goods_limit;
          }
        });
      }
      // 数据缓存
      if(cacheKey && qdKeys.length === 5 && area_id && 
        // pageIndex > 0 && pageIndex <= 5 && 
        pageIndex == 1 &&
        goods_limit == 3 &&
        struts == 1 
        // && biz_struts == 1 
        && _.isArray(stores) && stores.length > 0) {
        // const seconds = 60 * 60 * 24 * 7;
        // await this.setCache(cacheKey, stores, seconds);

        // cacheKey = CacheStoreListKey: area_id
        stores = JSON.parse(JSON.stringify(stores));
        const mdata = {};
        stores.forEach( st => mdata[st.id] = st );
        // 区域id 作为属性键
        await this.hashMSet({ key: cacheKey, data: mdata });

        // 控制主屏数据 过期时间
        const seconds = 60 * 60 * 3 * 1;
        await this.setCache(timerKey, ctx.NOW.toDatetime(), seconds);
      }

      
      // 响应查询结果
      return ctx.message.success(stores);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = StoreService;
