'use strict';
const _ = require('lodash');
const { Calendar, CalendarTypes } = require('calendar2');
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class AnalyzeService extends BaseService {
  /**
   * 查询商圈下订单额及数量数据
   * @param {*} options 
   */
  async areaOrderStatistics({area_id, orderstruts, refundstruts, begin_date, end_date, has_stores}) {
    const { ctx } = this;
    const sequelize = ctx.model;
    const { Order, XqStore } = sequelize;
    
    try {
      // 查询配置
      const options = { where: {} };
      // 配置条件
      if (area_id) { // 区域 id
        options.where.area_id = area_id;
      }
      if (orderstruts) { // 区域 id
        options.where.orderstruts = orderstruts;
      }
      if (refundstruts === 'all') { // 区域 id
        options.where.refundstruts = { [ctx.Op.not] : null };
      } else if (refundstruts === 'null') {
        options.where.refundstruts = null;
      } else if (refundstruts) {
        options.where.refundstruts = refundstruts;
      }
      if (begin_date && end_date) {
        options.where.create_at = { [ctx.Op.between] : [begin_date, end_date] };
      }
      // 连接查询
      if (has_stores) {
        options.include = [{ model: XqStore }];
      }
      // 分组
      options.group = 'store_id';
      // 排序关系
      options.order = sequelize.literal('sum_fee DESC');
      // 查询字段
      options.attributes = [
        'store_id', 
        [sequelize.fn('COUNT', sequelize.col('store_id')), 'order_count'], 
        [sequelize.fn('SUM', sequelize.col('total_fee')), 'sum_fee']
      ];
      // 1. 查询数据
      let orders = await Order.findAll(options);
      // 分析对象
      const analyzeData = {
        total_count: 0, total_fee: 0, active_stores: 0, total_stores: 0, stat_data: null,
      };
      // 2. 如数据不存在, 提供统一 Banner
      if (_.isArray(orders) && orders.length > 0) {
        orders = JSON.parse(JSON.stringify(orders));
        for (let i = 0; i < orders.length; i++) {
          const orderData = orders[i];
          analyzeData.total_count += Number(orderData.order_count);
          analyzeData.total_fee += Number(orderData.sum_fee);
          analyzeData.active_stores++;
        }
        analyzeData.stat_data = orders;
      }
      // 3. 查询商圈下所有激活的商铺数量
      analyzeData.total_stores = await XqStore.count({ where: { area_id, struts: '1'} });
      // 4. 查询订单数据包含的日期数组
      let dates = await Order.findAll({
        attributes: [
          [sequelize.literal('CONVERT(`create_at`, DATE)'), 'dt'], 
          // [sequelize.fn('COUNT', '1'), 'order_count'], 
          // [sequelize.fn('SUM', sequelize.col('total_fee')), 'sum_fee']
        ],
        group: sequelize.literal('CONVERT(`create_at`, DATE)'),
        where: {
          create_at: { [ctx.Op.between] : [begin_date, end_date] }
        },
        raw: true,
      });
      if (Array.isArray(dates)) {
        analyzeData.dates = dates.map( d => {
          const _date = new Date(d.dt);
          return {
            year: _date.getFullYear(),
            month: (_date.getMonth() + 1),
            day: (_date.getDate()),
            todoText: '销售',
            color: '#f40',
            ...d,
          };
        });
      }
      // 5. 返回数据
      return ctx.message.success(analyzeData);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = AnalyzeService;
