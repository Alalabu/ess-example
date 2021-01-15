'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');
const { CacheStoreInfoKey } = require('../util/redis-key');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class GoodsfoodService extends BaseService {
  /**
   * 查询商品食材关联列表
   * 返回商品(及营养数据)，和所关联的所有食材数据
   * @param {*} options 
   */
  async findAll({ goods_id }) {
    const { ctx } = this;
    const { Goods, GoodsFoodRel, Food } = ctx.model;
    try {
      // 排序关系
      const include = [{
        model: GoodsFoodRel, include: [{ model: Food }],
      }];
      // 1. 查询数据
      const goods = await Goods.findOne({ where: { id: goods_id }, include });
      return ctx.message.success(goods);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * 计算商品营养成分, 并返回计算好的成分对象
   */
  async calcGoodsNutrition({ goods_id }) {
    const { ctx } = this;
    const sequelize = ctx.model;
    const { Goods, GoodsFoodRel, Food } = sequelize;
    // 2. 查询当前商品的营养指标
    let goods = await Goods.findOne({ where: { id: goods_id }, include: [{
      model: GoodsFoodRel, include: [{ model: Food }],
    }] });
    if (!goods) {
      throw '计算营养成分时,没有找到匹配的商品。';
    }
    goods = JSON.parse(JSON.stringify(goods));
    // 3. 合并查询指标
    // 商品原有元素配置
    const {rl,zf,dbz,shhf,ssxw,wssa,las,su,ys,wsfc,wsse,shc,lb,dgc,gai,mei,tei,meng,xin,tong,jia,ling,la,xi} = goods;
    // 初始化元素数据
    const elements = {rl:0, zf:0, dbz:0, shhf:0, ssxw:0, wssa:0, las:0, su:0, ys:0, wsfc:0, wsse:0, shc:0, 
      lb:0, dgc:0, gai:0, mei:0, tei:0, meng:0, xin:0, tong:0, jia:0, ling:0, la:0, xi:0};
    // 4. 获取关联的食材数组
    const goods_food_rels = goods.goods_food_rels;
    if (!_.isArray(goods_food_rels) || goods_food_rels.length === 0) {
      elements.food_count = 0;
      return elements;
    }
    // 5. 遍历食材,获取营养元素,对初始化元素数据进行累加
    for (let x = 0; x < goods_food_rels.length; x++) {
      const rel = goods_food_rels[x];
      const { unit_num, food } = rel; // 获取食材数据,以及单位质量
      // 遍历食材的元素 key , 进行营养元素累加合并
      const el_keys = Object.keys(food);
      for (let y = 0; y < el_keys.length; y++) {
        const key = el_keys[y];
        if (food[key] && food[key] > 0 && elements[key] != null) {
          elements[key] += (unit_num / 100 * food[key]);
        }
      }
    }
    elements.food_count = goods_food_rels.length;
    // 6. 返回计算好的食物元素表
    return elements;
  }

  /**
   * 建立商品食材关联
   * 建立关联时,服务器端将汇总当前商品所关联的食材的总营养数值
   * @param {*} options 
   */
  async create({ store_id, goods_id, foods }) {
    const { ctx } = this;
    if (!foods || !_.isArray(foods)) {
      return ctx.message.param.miss({ foods });
    }
    const sequelize = ctx.model;
    const { Goods, GoodsFoodRel } = sequelize;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 获取待添加的食材 id 数组
      const per_add_ids = foods.map(f => f.food_id);
      // 2. 查询当前食材是否已经添加过
      const rel_count = await GoodsFoodRel.count({ where: { goods_id, food_id: { [ctx.Op.in]: per_add_ids } } });
      if (rel_count > 0) {
        return ctx.message.result.repetition({rel_count: rel_count}, '该商品已添加过该食材!');
      }
      // 1. 查询食材列表，查询食材营养指标
      // const foodList = await Food.findAll({
      //   where: { id: { [ctx.Op.in]: per_add_ids } },
      //   raw: true,
      // });
      // // 合并计量单位至食材列表
      // foodList.forEach( f => f.unit_num = foods.find( f2 => f2.food_id === f.id).unit_num );
      // // 2. 查询当前商品的营养指标
      // const goods = await Goods.findOne({ where: { id: goods_id }, raw: true });
      // // 3. 合并查询指标
      // // 商品原有元素配置
      // const {rl,zf,dbz,shhf,ssxw,wssa,las,su,ys,wsfc,wsse,shc,lb,dgc,gai,mei,tei,meng,xin,tong,jia,ling,la,xi} = goods;
      // // 初始化元素数据
      // const elements = Object.assign({rl:0, zf:0, dbz:0, shhf:0, ssxw:0, wssa:0, las:0, su:0, ys:0, wsfc:0, wsse:0, shc:0, 
      //   lb:0, dgc:0, gai:0, mei:0, tei:0, meng:0, xin:0, tong:0, jia:0, ling:0, la:0, xi:0}, 
      //   _.omitBy({rl,zf,dbz,shhf,ssxw,wssa,las,su,ys,wsfc,wsse,shc,lb,dgc,gai,mei,tei,meng,xin,tong,jia,ling,la,xi}, _.isNil));
      // // 食材列表遍历
      // const elementsKeys = Object.keys(elements);
      // for (let i = 0; i < foodList.length; i++) {
      //   const food = foodList[i];
      //   for (let x = 0; x < elementsKeys.length; x++) {
      //     const key = elementsKeys[x];
      //     if (food[key] && food[key] > 0 && elements[key] != null) {
      //       elements[key] += (food.unit_num / 100 * food[key]);
      //     }
      //   }
      // }
      // 3. 遍历写入食材关联
      for (let i = 0; i < foods.length; i++) {
        const food = foods[i];
        await GoodsFoodRel.create({
          id: ctx.uuid32,
          goods_id, 
          food_id: food.food_id,
          unit_num: food.unit_num,
          unit_text: 'g',
        }, {transaction});
      }
      // 4. 计算最新的商品营养价值 (包含食材数量)
      const elements = await this.calcGoodsNutrition({ goods_id });
      // 5. 更新商品的营养合计
      elements.update_at = ctx.NOW.toDatetime();
      const result = await Goods.update(elements, {
        where: {id: goods_id}, transaction,
      });
      // 6. 删除商户首页缓存
      const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.hashDeleteAll(storeInfoCacheKey); // 删除首屏缓存

      await transaction.commit();
      return ctx.message.success({result, elements});
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  /**
   * 移除商品食材关联
   * 移除关联时,服务器端将汇总(新的)当前商品所关联的食材的总营养数值
   * @param {*} options 
   */
  async remove({ store_id, goods_id, foods }) {
    const { ctx } = this;
    if (!foods || !_.isArray(foods)) {
      return ctx.message.param.miss({ foods });
    }
    const sequelize = ctx.model;
    const { Goods, GoodsFoodRel, Food } = sequelize;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 获取待添加的食材 id 数组
      const per_remove_ids = foods.map(f => f.food_id);
      // 2. 遍历删除食材关联
      await GoodsFoodRel.destroy({
        where: {
          goods_id, 
          food_id: {[ctx.Op.in]: per_remove_ids},
        },
        transaction,
      });
      // 3. 计算最新的商品营养价值 (包含食材数量)
      const elements = await this.calcGoodsNutrition({ goods_id });
      // 4. 更新商品的营养合计
      elements.update_at = ctx.NOW.toDatetime();
      const result = await Goods.update(elements, {
        where: {id: goods_id}, transaction,
      });
      // 6. 删除商户首页缓存
      const storeInfoCacheKey = `${CacheStoreInfoKey}:${store_id}`;
      await this.hashDeleteAll(storeInfoCacheKey); // 删除首屏缓存

      await transaction.commit();
      return ctx.message.success({result, elements});
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

}

module.exports = GoodsfoodService;
