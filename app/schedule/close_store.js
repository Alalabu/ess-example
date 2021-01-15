/**
 * 定时器 : 自动关闭商铺时间 (避免下单延误)
 * - 1. manager 启动时, 获取所有商圈所设定的 Hash 列表 以及 所有商铺所设置的自动关店时间, 并进行缓存;
 * - 2. 闭店时间由两个 Hash 表控制: 商圈 Hash 表 和 商铺 Hash 表。
 * - 3. 暂时先不提供 "商圈统一关闭店铺时间", 而是为商铺提供 "开关店时间" 设置
 * - 4. 每分钟, 对比当前时间是否有需要关店的店铺, Hash 表的 key 应当是一个 "HH:mm", 值是一个表示 [商铺id] 的数组;
 * - 5. 当商铺变更闭店时间时, 在变更处查询并 添加/移除 商铺所在 Hash 表中的时间定位.
 * - 6. 当遇到需要关闭的商铺时, 变更 商铺缓存列表/商铺主页信息缓存/数据库关店字段 
 * - 每一分钟进行时间检测
 */
const { CacheStoreListKey, CacheBizTimesKey } = require('../util/redis-key');

module.exports = app => {
  return {
    schedule: {
      // interval: '10s',
      cron: '0 */1 * * * *',
      type: 'worker',
      env: ['prod'],
    },
    async task(ctx) {
      // console.log('执行了定时器 sche01 !', new Date());
      const RedisBiz = ctx.service.base.base;
      const timeKey = ctx.NOW.toFormat('hh:mm');
      if (! (await RedisBiz.hashExists(CacheBizTimesKey, timeKey)) ) {
        return;
      }
      const stores = await RedisBiz.hashGetData(CacheBizTimesKey, timeKey);
      ctx.logger.info(`[${ctx.NOW.toDatetime()}] [store.biz.change] 待变动营业状态列表: `, stores);
      const sequelize = ctx.model;
      const { XqStore } = sequelize;
      const transaction = await sequelize.transaction(); // 事务
      try {
        const area_change_map = new Map();
        for (let i = 0; i < stores.length; i++) {
          const s = stores[i];
          const biz_struts = (s.exec === 'start' ? '1' : '0');
          await XqStore.update({ biz_struts }, { where: { id: s.store_id }, transaction });
          // 商圈 id 过滤
          if (s.area_id && ! area_change_map.has(s.area_id)) {
            area_change_map.set(s.area_id, true);
          }
        }
        // 清除缓存的商圈列表
        area_change_map.forEach(async (value, key) => {
          const cacheKey = `${CacheStoreListKey}:${key}`;
          await ctx.service.base.base.hashDeleteAll(cacheKey); // 删除首屏缓存
        });
        // 提交事务
        await transaction.commit();
        ctx.logger.info(`[${ctx.NOW.toDatetime()}] [store.biz.change] 变动商铺营业状态结果: `, stores);
      } catch (error) {
        await transaction.rollback();
        ctx.logger.error(error);
      }
    },// end: task()
  };
};