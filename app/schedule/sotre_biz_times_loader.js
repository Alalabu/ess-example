/**
 * 定时器 : 加载所需自动开启/关闭商铺的时间列表 (避免下单延误)
 */
const {Calendar, CalendarTypes} = require('calendar2');
const format = require('date-format');
const { CacheBizTimesKey } = require('../util/redis-key');

module.exports = app => {
  return {
    schedule: {
      // interval: '10s',
      immediate: true,
      cron: '0 0 2 * * *',
      type: 'worker',
      env: ['prod'],
    },
    async task(ctx) {
      // this.ctx = ctx;
      // this.app = ctx.app;
      ctx.logger.info('执行了定时器 sotre_biz_times_loader !', new Date());
      const { XqStore } = ctx.model;
      const stores = await XqStore.findAll({
        where: {
          [ctx.Op.or]: [{ start_time: { [ctx.Op.ne]: null } }, { stop_time: { [ctx.Op.ne]: null } }],
        },
        raw: true,
      });
      // 自动开关店铺列表中, 时间作为 key, 值是一个店铺状态数组, 包含 { store_id, exec = 'start' || 'stop' }
      const store_manage_queue = new Map();
      const now = new Calendar();
      for (const s of stores) {
        const start_time = s.start_time ? format('hh:mm', new Date(`${now.toDate()} ${s.start_time}`)) : null;
        const stop_time = s.stop_time ? format('hh:mm', new Date(`${now.toDate()} ${s.stop_time}`)) : null;
        // console.log('start_time: ', start_time);
        // console.log('stop_time: ', stop_time);
        if (start_time && !store_manage_queue.has(start_time)) {
          // 商铺 开始时间 存在, 且 时间段 并未存在于 管理队列
          store_manage_queue.set(start_time, [ { store_id: s.id, area_id: s.area_id ,exec: 'start' } ]);
        } else if (start_time && store_manage_queue.has(start_time)) {
          // 商铺 开始时间 存在, 且 时间段 存在于 管理队列
          const tmpList = store_manage_queue.get(start_time);
          tmpList.push({ store_id: s.id, area_id: s.area_id, exec: 'start' });
          store_manage_queue.set(start_time, tmpList);
        }
  
        if (stop_time && !store_manage_queue.has(stop_time)) {
          // 商铺 开始时间 存在, 且 时间段 并未存在于 管理队列
          store_manage_queue.set(stop_time, [ { store_id: s.id, area_id: s.area_id, exec: 'stop' } ]);
        } else if (stop_time && store_manage_queue.has(stop_time)) {
          // 商铺 开始时间 存在, 且 时间段 存在于 管理队列
          const tmpList = store_manage_queue.get(stop_time);
          tmpList.push({ store_id: s.id, area_id: s.area_id, exec: 'stop' });
          store_manage_queue.set(stop_time, tmpList);
        }
      }
      // 数据缓存于 Redis
      // console.log('商铺起始时间 Hash 表: ', store_manage_queue);
      // console.log('============= this.app.redis: ', app.redis);
      // await ctx.service.base.base.hashMSet({key: 'store.biz.times', data: store_manage_queue});
      if (app.redis) {
        try {
          // 清空现有的开关店时间
          await ctx.service.base.base.hashDeleteAll(CacheBizTimesKey);
          // 写入新的开关店时间
          const data = {};
          store_manage_queue.forEach((value, key) => data[key] = JSON.stringify(value));
          // console.log('============= 开关店时间列表存储结构: ', data);
          await app.redis.hmset(CacheBizTimesKey, data);
        } catch (error) {
          ctx.logger.error(error);
        }
        
  
        // console.log('商铺起始时间 Hash 表 2: ', await ctx.service.base.base.hashGetEntries('store.biz.times') );
        // await app.redis.hmset('store.biz.times', store_manage_queue);
      }
    },
    
  };
};