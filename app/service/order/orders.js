'use strict';
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 统一订单操作 管理
 */
class OrdersService extends BaseService {

  /**
   * 查询用户订单
   * @param {*} param0 
   */
  async findAll({ client_id, knight_id, seller_id, area_id, out_trade_no, short_no,
    date_begin, date_end, order_struts, is_refund, refund_struts, use_pattern, delivery_state,
    allowed_order_struts, // 排除的订单状态值/列表
    hasStore, // 是否显示商铺
    hasKnight, // 是否显示骑手
    hasClient, // 是否显示用户
    hasArea, // 是否显示商圈
    hasAddress, // 是否显示用户地址
    sort = 'date_desc', pageLimit = 20, pageIndex = 1, searchText = null }) {
    const { ctx } = this;
    // 获取操作用户
    const { Order, XqStore, XqKnight, XqClient, StoreArea, Address } = ctx.model;
    try {
      const where = {};
      const orderby = [];
      const limit = Number(pageLimit);
      const offset = ( pageIndex - 1 ) * limit;
      // 调用方条件
      if(client_id) where.client_id = client_id;
      if(knight_id) where.knight_id = knight_id;
      if(seller_id) where.store_id = seller_id; // store_id -> seller_id
      if(area_id) where.area_id = area_id;
      if (searchText != null && typeof searchText === 'string') {
        where.client_mobile = {[ctx.Op.like]: `%${searchText}%`};
      }
      // 计算条件
      if(out_trade_no) where.out_trade_no = { [ctx.Op.like]: `%${out_trade_no}` };
      if(short_no) where.short_no = short_no;
      if(date_begin && !date_end) where.create_at = {[ctx.Op.between]: [`${date_begin} 00:00`, `${date_begin} 23:59:59`]};
      if(date_begin && date_end) where.create_at = {[ctx.Op.between]: [`${date_begin} 00:00`, `${date_end} 00:00`]};
      // console.log('前台传输的数组order_struts => ', order_struts);

      // console.log('当前要查询的订单状态 1: ', order_struts);
      if(order_struts) {
        try {
          order_struts = JSON.parse(order_struts);
        } catch (error) {
          if (_.isString(order_struts) && order_struts.indexOf(',') > -1) {
            order_struts = order_struts.split(',');
          }
        }
        
        // console.log('当前要查询的订单状态 2: ', order_struts);

        if (_.isString(order_struts)) where.orderstruts = order_struts;
        else if (_.isArray(order_struts)) where.orderstruts = {[ctx.Op.in]: order_struts};
      }
      // 排除的订单状态
      if (allowed_order_struts) {
        if (_.isString(allowed_order_struts) && allowed_order_struts.indexOf(',') > -1) {
          allowed_order_struts = allowed_order_struts.split(',');
        }
        if (_.isString(allowed_order_struts)) where.orderstruts = {[ctx.Op.ne]: allowed_order_struts};
        else if (_.isArray(allowed_order_struts)) where.orderstruts = {[ctx.Op.notIn]: allowed_order_struts};
      }
      // 用户使用状态
      if(use_pattern) where.use_pattern = use_pattern;
      // 配送方式
      if(delivery_state) where.delivery_state = delivery_state;
      // 退费状态
      // if(is_refund === true) where.refund_struts = {[ctx.Op.not]: null};
      // else if(is_refund === false) where.refund_struts = null;
      if(refund_struts) {
        if (_.isString(refund_struts) && refund_struts.indexOf(',') > -1) {
          refund_struts = refund_struts.split(',');
        }

        if (refund_struts === 'null') where.refund_struts = null;
        else if (_.isString(refund_struts)) where.refund_struts = refund_struts;
        else if (_.isArray(refund_struts)) where.refund_struts = {[ctx.Op.or]: refund_struts};
        // else where.refund_struts = null;
      }
      // 计算排序
      if(sort) {
        if(sort === 'date_desc') orderby.push(['create_at', 'DESC']);
      }
      // 连接查询
      const include = [];
      // 连接商户信息
      if(hasStore) include.push({ model: XqStore }); 
      if(hasKnight) include.push({ model: XqKnight });
      if(hasClient) {
        const client_include = { model: XqClient };
        // if (searchText != null && typeof searchText === 'string') {
        //   client_include.where = {
        //     phonenum: {[ctx.Op.like]: `%${searchText}%`},
        //   };
        // }
        include.push(client_include);
      }
      if(hasArea) include.push({ model: StoreArea });
      if(hasAddress) include.push({ model: Address });
      // console.log('订单单例查询时的关联表: ', include);
      // 查询配置
      const query_options = { where, limit, offset, order: orderby, include };
      // 查询
      const result = await Order.findAll(query_options);
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  /**
   * (统一) 查询订单单例
   * @param {*} param0 
   */
  async find({ out_trade_no, 
    hasStore, // 是否显示商铺
    hasKnight, // 是否显示骑手
    hasClient, // 是否显示用户
    hasArea, // 是否显示商圈
    hasAddress, // 是否显示用户地址
   }) {
     console.log('订单详情参数:', {out_trade_no, hasStore, hasKnight, hasClient, hasArea, hasAddress});
    const {ctx} = this;
    try {
      const { Order, OrderGoodsRelation, Goods, XqStore, XqKnight, XqClient, StoreArea, Address } = ctx.model;
      const include = [{
        model: OrderGoodsRelation, include: [{
          model: Goods
        }],
      }];
      // 连接商户信息
      if(hasStore) include.push({ model: XqStore }); 
      if(hasKnight) include.push({ model: XqKnight });
      if(hasClient) include.push({ model: XqClient });
      if(hasArea) include.push({ model: StoreArea });
      if(hasAddress) include.push({ model: Address });
      // 执行查询
      const result = await Order.findOne({ where: {out_trade_no}, 
        include,
      });
      return ctx.message.success(result);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }

  /**
   * (统一) 订单数量统计
   * @param {*} param0 
   */
  async doneCount({area_id, date_begin, date_end}) {
    // console.log('订单详情参数:', {out_trade_no, hasStore, hasKnight, hasClient, hasArea, hasAddress});
    const {ctx} = this;
    try {
      const { Order } = ctx.model;
      // 执行查询
      const result = await Order.findAll({
        attributes: ['orderstruts', 'refund_struts', 'use_pattern'],
        where: {
          area_id,
          create_at: {[ctx.Op.between]: [`${date_begin} 00:00`, `${date_end} 00:00`]}
        },
        raw: true,
      });
      const stat = {
        done: 0,
        undone: 0,
        refund: 0,
        delivery: 0,
        takeself: 0,
        eatin: 0,
      };
      for (let x = 0; x < result.length; x++) {
        const o = result[x];
        if (o.refund_struts) { // 退费
          stat.refund++;
          continue;
        }
        //
        if (o.orderstruts == 'order_done') stat.done++;
        else stat.undone++;
        // 
        stat[o.use_pattern]++;
      }
      return ctx.message.success(stat);
    } catch (error) {
      return ctx.message.exception(error);
    }
  }
}

module.exports = OrdersService;
