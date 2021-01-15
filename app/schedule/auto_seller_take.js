/**
 * 定时器 : 加载所需自动开启/关闭商铺的时间列表 (避免下单延误)
 */
const _ = require('lodash');
const {Calendar, CalendarTypes} = require('calendar2');
const ORDER_STRUTS = require('../enums/order_struts');

module.exports = app => {
  return {
    schedule: {
      // interval: '10s',
      immediate: true,
      cron: '0 */1 * * * *',
      type: 'worker',
      env: ['prod'],
    },
    async task(ctx) {
      // 寻找可以被执行自动完成的订单, 调用订单完成操作
      console.log('执行了定时器 auto_seller_take !', new Date());
      const now = new Calendar(); // 现在
      // order_done_at.add(-1, CalendarTypes.MINUTES); // 当前时间 - 30min < seller_done_at ? 完成订单时机

      const { Order, XqStore } = ctx.model;
      const orderList = await Order.findAll({
        attributes: ['store_id', 'out_trade_no', 'update_at'],
        include: [{
          attributes: ['id'],
          model: XqStore, where: {
            auto_takeorder: '1', // 自动接单选项
          },
        }],
        where: {
          orderstruts: ORDER_STRUTS.SELLER_TAKE,
          refund_struts: null, // 未退费
          appointment: {[ctx.Op.lt]: now.toDatetime()}, // 出单时机 = 当前时间 > 预约时间
        },
      });
      // 自动开关店铺列表中, 时间作为 key, 值是一个店铺状态数组, 包含 { store_id, exec = 'start' || 'stop' }
      if (_.isArray(orderList)) {
        const simpleOrderList = JSON.parse(JSON.stringify(orderList));
        for (let x = 0; x < simpleOrderList.length; x++) {
          const o = simpleOrderList[x];
          await ctx.service.seller.publish({
            seller_id: o.store_id, 
            out_trade_no: o.out_trade_no, 
            update_at: o.update_at,
            historyTag: '(auto)',
          });
        }
      } // end: if (_.isArray(orderList))
      
    },
    
  };
};