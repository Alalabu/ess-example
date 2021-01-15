'use strict';
const _ = require('lodash');
const BaseService = require('./base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class AnalyzeService extends BaseService {
  /**
   * 订单时段的汇总分析
   * @param {*} options 
   */
  async timeSummary({area_id, store_id}) {
    const { ctx } = this;
    const { Order, OrderGoodsRelation } = ctx.model;
    try {
      const options = {};
      options.where = {
        area_id,
        store_id,
        orderstruts: {
          [ctx.Op.in]: ['payed', 'knight_take', 'seller_take'],
        },
        refund_struts: null,
      };
      // 排序
      options.order = [['appointment', 'ASC']];
      // 级联
      options.include = [{ model: OrderGoodsRelation }];
      // 查询
      let orderList = await Order.findAll(options);
      // 数据简化及汇总
      if (!_.isArray(orderList)) {
        return ctx.message.success([]); // 无数据
      }
      orderList = JSON.parse(JSON.stringify(orderList));
      const summaryList = []; // 汇总列表
      let summaryIndex = -1;
      let timeInterval = null;
      for (let i = 0; i < orderList.length; i++) {
        const order = orderList[i];
        const ad = new Date(order.appointment);
        const appointmentHour = `${ad.getFullYear()}-${(ad.getMonth() + 1)}-${ad.getDate()} ${ad.getHours()}`;
        if (timeInterval !== appointmentHour) {
          summaryIndex++;
          if (!summaryList[summaryIndex]) { // 初始化数据汇总
            timeInterval = appointmentHour;
            summaryList[summaryIndex] = {
              date: `${ad.getFullYear()}-${(ad.getMonth() + 1)}-${ad.getDate()}`,
              timeBegin: `${ad.getHours()}`,
              timeEnd: `${(ad.getHours() + 1 === 24 ? '00': ad.getHours() + 1)}`,
              orders: [],
              // goods: { length : 0 },
              goods: new Map(),
            };
          }
        }
        // console.log('timeInterval !== appointmentHour  => ', timeInterval, ' !== ', appointmentHour);
        // console.log(appointmentHour, ` 时段对象 [${summaryIndex}]: `, summaryList[summaryIndex]);
        summaryList[summaryIndex].orders.push( order );
        // let goodsLength = 0;
        for (let x = 0; x < order.order_goods_relations.length; x++) {
          const goods = order.order_goods_relations[x];
          if (!summaryList[summaryIndex].goods.has( goods.goods_id ) ) {
            // 商品不存在, 则初始化商品
            summaryList[summaryIndex].goods.set( goods.goods_id , {
              goods_id: goods.goods_id,
              goods_title: goods.goods_title,
              total_fee: goods.total_fee,
              count: goods.count,
            });
          } else {
            // 商品存在, 则数量自增
            summaryList[summaryIndex].goods.get( goods.goods_id ).count += goods.count;
          }
        }
      }
      // 将 summaryList 中的 goods 转换成数组
      summaryList.forEach( s => s.goods = Array.from(s.goods.values()) );
      // 响应到前台
      return ctx.message.success(summaryList);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = AnalyzeService;
