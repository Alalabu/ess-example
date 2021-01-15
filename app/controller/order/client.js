'use strict';
const xml2js = require('xml2js').parseString;
const Controller = require('egg').Controller;

class ClientController extends Controller {
  /**
   * 预付订单
   */
  async prepay() {
    const { ctx } = this;
    const { openid, client_id, address_id, order_tags, remark, use_pattern,
      seller_id, seller_name, goods_list, delivery_fee, origin_fee, total_fee,
      meal_fee, appointment, area_id, ticket_area, ticket_store,
    } = ctx.request.body;
    if (!openid || !client_id || !use_pattern || !area_id ||
      !seller_id || !seller_name || !goods_list || !total_fee) {
      ctx.body = ctx.message.param.miss({ openid, client_id, address_id, order_tags, remark, use_pattern, 
        seller_id, seller_name, goods_list, delivery_fee, origin_fee, total_fee, area_id });
      return;
    }
    ctx.body = await ctx.service.order.client.prepay({ openid, client_id, address_id, order_tags, remark, use_pattern,
      seller_id, seller_name, goods_list, delivery_fee, origin_fee, total_fee, meal_fee, appointment, area_id,
      ticket_area, ticket_store, // 优惠券
    });
  }

  /**
   * 取消/关闭订单
   * - 订单支付失败时, 用户可选项有: 重新支付 or 取消订单
   * - 取消订单: 直接将该订单关闭
   * - 重新支付: 将原订单关闭, 以原订单数据发起新的支付过程
   */
  async closeorder() {
    const { ctx } = this;
    const { client_id, seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!client_id || !seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ client_id, seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.client.closeorder({ client_id, seller_id, out_trade_no, update_at });
  }

  /**
   * 订单重新支付
   * - 将该订单作为原始订单, 关闭
   * - 创建新的订单预支付
   */
  async payagain() {
    const { ctx } = this;
    const { openid, client_id, seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!openid || !client_id || !seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ openid, client_id, seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.client.payagain({ openid, client_id, seller_id, out_trade_no, update_at });
  }

  /**
   * 退费
   */
  async refund() {
    const { ctx } = this;
    const { seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.client.refund({ seller_id, out_trade_no, update_at });
  }

  /**
   * 支付通知
   */
  async payNotify() {
    const { ctx } = this;
    const $options = ctx.request.body.$options;
    if(!$options || !$options.xml) {
      ctx.body = { msg: '没有找到有效的XML请求数据!' };
      return;
    }
    const informData = $options.xml;
    // ctx.logger.info('controller.payNotify.informData : ', informData);
    const informRes = await ctx.service.order.client.payNotify(informData);
    ctx.body = informRes;
  }

  /**
   * 退费通知
   */
  async refundNotify() {
    const { ctx } = this;
    const $options = ctx.request.body.$options;
    if(!$options || !$options.xml) {
      ctx.body = { msg: '没有找到有效的XML请求数据!' };
      return;
    }
    const informData = $options.xml;
    const informRes = await ctx.service.order.client.refundNotify(informData);
    ctx.body = informRes;
  }

  /**
   * (用户端) 查询订单列表
   */
  async findAll() {
    const { ctx } = this;
    const { client_id, out_trade_no, short_no, date_begin, date_end, allowed_order_struts,
      order_struts, is_refund, sort, pageLimit, pageIndex } = ctx.query;
    if (!client_id) {
      ctx.body = ctx.message.param.miss({ client_id, out_trade_no, short_no, date_begin, date_end, allowed_order_struts,
        order_struts, is_refund, sort, pageLimit, pageIndex });
      return;
    }
    ctx.body = await ctx.service.order.client.findAll({ client_id, out_trade_no, short_no, date_begin, date_end,
      allowed_order_struts,
      order_struts, is_refund, sort, pageLimit, pageIndex });
  }

  /**
   * (用户端) 查询订单详情
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
    ctx.body = await ctx.service.order.client.find({out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore});
  }

  /**
   * (用户端) 查询本日在某商户已购 (且限购) 的商品列表
   */
  async findTodayGoods() {
    const { ctx } = this;
    // const { out_trade_no } = ctx.request.body;
    const { client_id, store_id } = ctx.query;
    // console.log('client.order controller find 1: ', out_trade_no);
    if (client_id == null || store_id == null) {
      ctx.body = ctx.message.param.miss({ client_id, store_id });
      return;
    }
    ctx.body = await ctx.service.order.client.findTodayGoods({client_id, store_id});
  }

  /**
   * 
   */
  // async tablesign() {
  //   const { ctx } = this;
  //   const { area_id } = ctx.request.body;
  //   if (!area_id) {
  //     ctx.body = ctx.message.param.miss({ area_id });
  //     return;
  //   }
  //   ctx.body = await ctx.service.pa.area.tablesign(area_id);
  // }
}

module.exports = ClientController;
