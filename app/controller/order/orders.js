'use strict';

const Controller = require('egg').Controller;

class OrdersController extends Controller {

  /**
   * (统一) 查询订单列表
   */
  async findAll() {
    const { ctx } = this;
    const { client_id, out_trade_no, short_no, area_id, date_begin, date_end, allowed_order_struts,
      order_struts, is_refund, sort, pageLimit, pageIndex, searchText, use_pattern,
      hasStore, hasKnight, hasClient, hasArea, hasAddress} = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ client_id, out_trade_no, short_no, area_id, date_begin, date_end, allowed_order_struts,
        order_struts, is_refund, sort, pageLimit, pageIndex, searchText, hasStore, hasKnight, hasClient, hasArea, hasAddress,
        use_pattern, });
      return;
    }
    ctx.body = await ctx.service.order.orders.findAll({ client_id, out_trade_no, short_no, area_id, date_begin, date_end,
      allowed_order_struts, order_struts, is_refund, sort, pageLimit, pageIndex, searchText, use_pattern,
      hasStore, hasKnight, hasClient, hasArea, hasAddress });
  }

  /**
   * (统一) 查询订单单例
   * @param {*} param0 
   */
  async find() {
    const { ctx } = this;
    // const { out_trade_no } = ctx.request.body;
    const { out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore } = ctx.query;
    // console.log('client.order controller find 1: ', out_trade_no);
    if (!out_trade_no) {
      ctx.body = ctx.message.param.miss({ out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore });
      return;
    }
    ctx.body = await ctx.service.order.orders.find({out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore});
  }

  /**
   * (统一) 查询已完成订单数量, 和未完成订单数量
   * @param {*} param0 
   */
  async doneCount() {
    const { ctx } = this;
    // const { out_trade_no } = ctx.request.body;
    const { area_id, date_begin, date_end } = ctx.query;
    // console.log('client.order controller find 1: ', out_trade_no);
    if (area_id == null || date_begin == null || date_end == null) {
      ctx.body = ctx.message.param.miss({ area_id, date_begin, date_end });
      return;
    }
    ctx.body = await ctx.service.order.orders.doneCount({area_id, date_begin, date_end});
  }
}

module.exports = OrdersController;
