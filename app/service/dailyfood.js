'use strict';
const _ = require('lodash');
const {Calendar, CalendarTypes} = require('calendar2');
const BaseService = require('./base/base');

/**
 * 每日食物清单 管理
 */
class DailyfoodService extends BaseService {

  /**
   * 修改食物清单中摄入量
   * @param use_percent [Number] 食物摄入量, 默认 100%
   * 公式: 食物摄入营养 = 食物所含食材营养 * 数量 * 摄入量
   */
  async update({ dailyfood_id, use_percent }) {
    const {ctx} = this;
    if (typeof use_percent != 'number') {
      use_percent = Number(use_percent);
    }
    if (!_.isInteger(use_percent) || use_percent < 0 || use_percent > 100) {
      return ctx.message.dailyfood.usePercentInvalid({ dailyfood_id, use_percent });
    }
    try {
      const { XqClientDailyfood } = ctx.model;
      const result = await XqClientDailyfood.update({ use_percent }, {
        where: { id: dailyfood_id }
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 删除食物清单中的食物
   */
  async delete({ dailyfood_id }) {
    const {ctx} = this;
    try {
      const { XqClientDailyfood } = ctx.model;
      const result = await XqClientDailyfood.destroy({
        where: { id: dailyfood_id }
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询摄入食物清单(列表)
   */
  async findAll({client_id, begin_date, end_date, pageIndex=1, limit=20}) {
    const {ctx} = this;
    try {
      const { XqClientDailyfood, XqStore, Goods } = ctx.model;
      const orderby = [['pay_at', 'DESC']];
      const include = [
        { model: XqStore }, { model: Goods }, 
      ];
      const whereby = { client_id };
      if (begin_date && end_date) {
        whereby.pay_at = {[ctx.Op.between]: [begin_date, end_date]};
      }
      if (typeof pageIndex != 'number') {
        pageIndex = Number(pageIndex);
      }
      if (typeof limit != 'number') {
        limit = Number(limit);
      }
      const offset = (pageIndex - 1) * limit;

      const result = await XqClientDailyfood.findAll({ where: whereby, order: orderby, include, offset, limit });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询每日摄入营养数据
   * 查询你的默认标准, 以及你的(某阶段)食物摄入营养
   */
  async analyze({ client_id, begin_date, end_date }) {
    const {ctx} = this;

    try {
      const { XqClientNst, FoodNutritionStandard, XqClientDailyfood, Goods } = ctx.model;
      // 1. 查询你的默认标准
      let standard = await XqClientNst.findOne({ where: {client_id, is_default: '1'}, raw: true });
      if (!standard) {
        // 没有默认标准, 则采用系统标准
        const standard_id = '9bffff57b9e611eaa42600163e00b07d';
        standard = await FoodNutritionStandard.findOne({ where: {id: standard_id}, raw: true });
      }
      // 2. 查询你的(某阶段)食物摄入营养
      let goodsList = await XqClientDailyfood.findAll({
        where: {
          client_id,
          pay_at: {[ctx.Op.between]: [begin_date, end_date]},
        },
        include: [{model: Goods}],
        // raw: true,
      });
      
      // 3. 计算你的食物摄入总和
      const total_nutrition = {rl:0, zf:0, dbz:0, shhf:0, ssxw:0, wssa:0, las:0, su:0, 
        ys:0, wsfc:0, wsse:0, shc:0, lb:0, dgc:0, gai:0, mei:0, tei:0, meng:0, xin:0, tong:0, jia:0, ling:0, la:0, xi:0};
      let total_days = 0; // 本次计算中所涉及的总天数
      const days = []; // 本次计算中的日期列表
      const el_keys = Object.keys(total_nutrition);
      if (_.isArray(goodsList)) {
        goodsList = JSON.parse(JSON.stringify(goodsList));
        let tmpDate = null;
        for (let x = 0; x < goodsList.length; x++) {
          const daily = goodsList[x]; // 获取每一个订单商品
          const goods = daily.good; // 获取每一个食物
          // console.log(`[${x}] 商品: `, daily);
          const pay_at_date = (new Calendar(daily.pay_at)).toDate();
          if (pay_at_date != tmpDate) {
            tmpDate = pay_at_date;
            total_days++;
            days.push(tmpDate);
          }
          for (let y = 0; y < el_keys.length; y++) {
            const k = el_keys[y];
            if (goods[k]) {
              // 公式: 食物摄入营养 = 食物所含食材营养 * 数量 * 摄入量
              total_nutrition[k] += (goods[k] * daily.gcount * (daily.use_percent / 100));
              total_nutrition[k] = Number(total_nutrition[k].toFixed(2))
            }
          }
        }
      }

      const result = {total_nutrition, total_days, days, standard};
      // 返回结果
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * 查询摄入食物清单(列表)
   */
  async dateStat({client_id, begin_date, end_date}) {
    const {ctx} = this;
    const sequelize = ctx.model;
    try {
      const { XqClientDailyfood } = sequelize;
      const attributes = [ [sequelize.literal('CONVERT(`pay_at`, DATE)'), 'pay_at'] ];
      const whereby = { client_id };
      if (begin_date && end_date) {
        whereby.pay_at = {[ctx.Op.between]: [begin_date, end_date]};
      }
      // 统计数据
      const stat = await XqClientDailyfood.findAll({
        group: sequelize.literal('CONVERT(`pay_at`, DATE)'),
        attributes, where: whereby, raw: true
      });
      if (!_.isArray(stat)) {
        return [];
      }

      return ctx.message.success(stat.map( el => {
        const day = new Calendar(el.pay_at);
        return {
          color: "#f40",
          day: day.getDate(),
          dt: day.toDate(),
          month: day.getMonth() + 1,
          todoText: "销售",
          year: day.getFullYear(),
        };
      } ));
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

}

module.exports = DailyfoodService;
