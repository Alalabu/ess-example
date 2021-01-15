'use strict';
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class HomeService extends BaseService {
  /**
   * 查找女生最喜欢的10中食物, 以及销售量排名
   */
  async findAll({ cacheKey, pageIndex }) {
    const cacheData = await this.getCache(cacheKey);
    console.log('[Redis cacheData] in : ', cacheKey);
    if (cacheData) {
      console.log(`[Redis cacheData] use redis by cacheKey=${cacheKey}.`);
      return cacheData;
    }
    const { ctx } = this;
    const sequelize = ctx.model;
    const { Order, Address, Goods, Ordergoodsrelation } = ctx.model;
    // 调用 getConfig 接口
    const include = [
      { model: Address, as: 'orderAddress', attributes: [], required: true, where: { gender: 0 } },
      { model: Ordergoodsrelation, as: 'ordergoodsrelation',
        attributes: [
          [ sequelize.fn('SUM', sequelize.col('goods_count')), 'gctotal' ],
        ],
        include: [{
          model: Goods, as: 'goods', required: true,
          attributes: [ 'id', 'title' ],
        }],
        required: true,
      },
    ];

    const limit = 10;
    const page = {
      offset: ((pageIndex - 1) * limit), limit,
    };
    const datas = await Order.findAll({
      attributes: [],
      include,
      ...page,
      group: [
        sequelize.col('ordergoodsrelation.goods.id'),
        sequelize.col('ordergoodsrelation.goods.title'),
      ],
      order: sequelize.literal('`ordergoodsrelation.gctotal` DESC'),
      // plain: true,
      raw: true,
    });
    // 数据字段简化
    const resData = datas.map(d => {
      return {
        id: d['ordergoodsrelation.goods.id'],
        title: d['ordergoodsrelation.goods.title'],
        gctotal: d['ordergoodsrelation.gctotal'],
      };
    });
    const res = {
      pid: process.pid,
      data: resData,
    };
    // 数据缓存
    await this.setCache(cacheKey, res, 30);
    return res;
  }
}

module.exports = HomeService;
