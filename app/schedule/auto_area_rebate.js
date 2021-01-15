/**
 * 定时器 : 自动返现
 */
const _ = require('lodash');
// const {Calendar, CalendarTypes} = require('calendar2');
// const ORDER_STRUTS = require('../enums/order_struts');

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
      console.log('执行了定时器 auto_area_rebate !', new Date());
      const now = new Date(); // 现在
      const hour = now.getHours();
      const min = now.getMinutes();

      const { StoreAreaRebate } = ctx.model;
      const rebateList = await StoreAreaRebate.findAll({
        where: {
          for_hour: hour,
          for_min: min,
          struts: '1',
        },
        raw: true,
      });
      // 自动开关店铺列表中, 时间作为 key, 值是一个店铺状态数组, 包含 { store_id, exec = 'start' || 'stop' }
      if (_.isArray(rebateList) && rebateList.length > 0) {
        
        for (let x = 0; x < rebateList.length; x++) {
          const rebate = rebateList[x];
          await ctx.service.rebate.execute_rebate(rebate);
        }
      } // end: if (_.isArray(orderList))
      
    },
    
  };
};