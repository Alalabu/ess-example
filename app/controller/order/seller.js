'use strict';
const _ = require('lodash');
const Controller = require('egg').Controller;

class SellerController extends Controller {
  /**
   * 商家放弃订单
   * 前置状态: payed
   * 后置状态: seller_excep
   */
  async giveup() {
    const { ctx } = this;
    const { seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.seller.giveup({seller_id, out_trade_no, update_at});
  }

  /**
   * 商家宣布出单
   *  - 如果是配送单, 上一个状态必须是 "knight_take" 骑手已接单, 或者是 "seller_take" 商家已接单（商家可以临时调整骑手未接的单自己配送）; 
   *  - 如果是 堂食/自取 单, 则上一状态必须是 "seller_take" (商户已接单);
   * 后置状态: seller_done
   */
  async publish() {
    const { ctx } = this;
    const { seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.seller.publish({seller_id, out_trade_no, update_at});
  }

  /**
   * 商家接单
   *  - 配送单, 订单状态为: "payed", 商家配送选项为: "第三方配送"。商家需要临时调整订单状态为: "商家配送", 
   *    则直接调用"商家接单"接口, 将订单状态修改为: "seller_take";
   *  - 堂食/自取单, 订单状态为: "payed", 商家自动接单选项为: "0"(关闭), 则可调用该接口, 将订单状态修改为: "seller_take";
   * 前置状态: payed
   * 后置状态: seller_done
   */
  async orderTake() {
    const { ctx } = this;
    const { store_id, out_trade_no, update_at } = ctx.request.body;
    if (!store_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ store_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.seller.orderTake({store_id, out_trade_no, update_at});
  }

  /**
   * 商家宣布出单
   * 前置状态: payed, knight_take(骑手已接单)
   * 后置状态: seller_done
   */
  async finish() {
    const { ctx } = this;
    const { seller_id, out_trade_no, update_at } = ctx.request.body;
    if (!seller_id || !out_trade_no || !update_at) {
      ctx.body = ctx.message.param.miss({ seller_id, out_trade_no, update_at });
      return;
    }
    ctx.body = await ctx.service.order.seller.finish({seller_id, out_trade_no, update_at});
  }

  /**
   * (商家端) 查询订单列表
   */
  async findAll() {
    const { ctx } = this;
    const { seller_id, knight_id, client_id, out_trade_no, short_no, date_begin, date_end, use_pattern, delivery_state,
      order_struts, allowed_order_struts, is_refund, refund_struts, sort, pageLimit, pageIndex,
      hasKnight, hasClient, hasAddress,
    } = ctx.query;
    if (!seller_id) {
      ctx.body = ctx.message.param.miss({ seller_id, knight_id, client_id, out_trade_no, short_no, date_begin, date_end,
        hasKnight, hasClient, hasAddress, refund_struts, 
        use_pattern, allowed_order_struts, delivery_state, order_struts, is_refund, sort, pageLimit, pageIndex });
      return;
    }
    ctx.body = await ctx.service.order.seller.findAll({ seller_id, knight_id, client_id, out_trade_no, short_no, date_begin, date_end,
      hasKnight, hasClient, hasAddress, refund_struts, 
      use_pattern, allowed_order_struts, delivery_state, order_struts, is_refund, sort, pageLimit, pageIndex });
  }

  /**
   * (商家端) 查询订单详情
   */
  async find() {
    const { ctx } = this;
    const { out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore } = ctx.query;
    if (!out_trade_no) {
      ctx.body = ctx.message.param.miss({ out_trade_no });
      return;
    }
    ctx.body = await ctx.service.order.seller.find({out_trade_no, hasKnight, hasClient, hasAddress, hasArea, hasStore});
  }

  /**
   * 查询商户提现数据
   */
  async getWithdrawalStat() {
    const { ctx } = this;
    const { store_id } = ctx.query;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.order.seller.getWithdrawalStat({ store_id });
  }

  /**
   * 查询商户提现记录
   */
  async getWithdrawalRecords() {
    const { ctx } = this;
    const { store_id, limit, pageIndex } = ctx.query;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id, limit, pageIndex });
      return;
    }
    ctx.body = await ctx.service.order.seller.getWithdrawalRecords({ store_id, limit, pageIndex });
  }

  /**
   * 查询商户入账记录
   */
  async getIncomeRecords() {
    const { ctx } = this;
    const { store_id, limit, pageIndex } = ctx.query;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id, limit, pageIndex });
      return;
    }
    ctx.body = await ctx.service.order.seller.getIncomeRecords({ store_id, limit, pageIndex });
  }

  /**
   * 商户提现操作
   */
  async withdrawal() {
    const { ctx } = this;
    const { store_id, seller_id, total_fee, latest_withdrawal_at, update_at } = ctx.request.body;
    if (!store_id || !seller_id || !total_fee || latest_withdrawal_at === undefined || update_at === undefined) {
      ctx.body = ctx.message.param.miss({ store_id, seller_id, total_fee, latest_withdrawal_at, update_at });
      return;
    }
    if (!_.isInteger(total_fee) || total_fee <= 0) {
      ctx.body = ctx.message.param.invalid({ store_id, seller_id, total_fee, latest_withdrawal_at, update_at }, `total_fee is not a Integer: ${total_fee}`);
      return;
    }
    ctx.body = await ctx.service.order.seller.withdrawal({ store_id, seller_id, total_fee, latest_withdrawal_at, update_at });
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

module.exports = SellerController;
