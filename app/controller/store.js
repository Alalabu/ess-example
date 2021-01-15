'use strict';

const Controller = require('egg').Controller;
/**
 * 处理商户相关事务
 */
class StoreController extends Controller {

  async find() {
    const { ctx } = this;
    const { store_id, has_channel, has_goods, has_tags, has_order_tags } = ctx.query;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id, has_channel, has_goods, has_tags, has_order_tags });
      return;
    }
    ctx.body = await ctx.service.store.find({store_id, has_channel, has_goods, has_tags, has_order_tags});
  }

  /**
   * 查询商铺列表
   * 客户端应用: 
   *  - 首屏: 查询 area_id (商圈)下的商铺,及商铺中的商品
   * 管理端:
   *  - 查询商铺列表
   */
  async findAll() {
    const { ctx } = this;
    const { area_id, city_code, keyword, goods_limit, longitude, latitude, sort, pageIndex, pageLimit,
      struts, biz_struts, can_delivery, can_takeself, can_eatin, can_tablesign, good_type, dining_id,
      hasDining,
    } = ctx.request.body;

    ctx.body = await ctx.service.store.findAll({ area_id, city_code, keyword, goods_limit, longitude, latitude, sort, 
      pageIndex, pageLimit, good_type, dining_id, hasDining,
      struts, biz_struts, can_delivery, can_takeself, can_eatin, can_tablesign
    });
  }
}

module.exports = StoreController;
