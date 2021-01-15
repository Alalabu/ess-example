'use strict';
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

const BaseService = require('../base/base');
const xml2js = require('xml2js');
const { Calendar, CalendarTypes } = require('calendar2');

const ORDER_STRUTS = require('../../enums/order_struts');
const USE_PATTERN = require('../../enums/use_pattern');
const DELIVERY_STRUTS = require('../../enums/delivery_struts');

const XMLBuilder = new xml2js.Builder({
  rootName: 'xml',
  headless: true,
  renderOpts: {
    pretty: false,
  },
});

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class NotifyprocessService extends BaseService {

  /**
   * 获取公众号的 access_token
   * @param {*} unionid 随便给个值
   */
  async getOfficialAccessToken(unionid) {
    const { ctx } = this;
    const header = {
      authorization: ctx.generateToken({ 
        params: { unionid },
        secret: ctx.app.config.jwt.secret,
        expiresIn: (5 * 60 * 60)
      })
    };
    // 获取公众号的 access_token
    const secret = '1e145f108f4711eabe3100ff9846b53f';
    const at_options = {
      key: '1e145f0a8f4711eabe3100ff9846b53f',
      timeStamp: ctx.timeStamp, nonceStr: ctx.getNonceStr(16),
    };
    at_options.sign = ctx.parseSign(at_options, secret);
    // 2. 获取公众号的AT
    ctx.logger.info('【支付通知】准备获取公众号的 access_token...');
    // const at_result = await ctx.app.seneca("wechat","official/accessToken", at_options);
    const at_result = await ctx.curl('https://g.she-u.cn/wechat/official/accessToken', {
      dataType: 'json', method: 'POST', data: at_options, headers: header
    });
    if(!at_result?.data || at_result.data.err) {
      ctx.logger.error('【支付通知】准备获取公众号的 access_token失败:', at_result);
    }
    ctx.logger.info('【支付通知】获取公众号的 access_token 成功: ', at_result);
    const gzh_access_token = at_result.data.data.access_token; // 公众号的 Access_Token
    return gzh_access_token;
  }
  /**
   * 生成打印文本
   * @param {*} param0 
   */
  getPrintString({ shortNo, out_trade_no, use_pattern, appointment, goodsList, total_fee, tags, remark, create_at,
    client_name, client_gender, client_mobile, client_area_scope, client_address_detail
  }) {
    let orderInfo = '';
    // 商户联
    orderInfo += "<CB>社有食纪 【商户联】</CB><BR>";//标题字体如需居中放大,就需要用标签套上
    orderInfo += `<CB>${shortNo}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `<CB>〓 ${use_pattern} 〓</CB><BR>`;
    orderInfo += `预约时间：<BR>`;
    orderInfo += `<CB>${appointment}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `订单号: ${out_trade_no}<BR>`;
    orderInfo += "--------------------------------<BR>";
    for(let i = 1; i <= goodsList.length; i++){
      let goods = goodsList[i-1];
      orderInfo += `<L>${i}. `+ goods.goods_title +"</L><BR>";
      orderInfo += "<B>数量："+ goods.count+ "</B>　<BOLD>单价:"+ goods.total_fee/100+ "　总价:"+ (goods.total_fee * goods.count)/100+ "</BOLD><BR><BR>"
    }
    orderInfo += "--------------------------------<BR>";
    orderInfo += `标注：<L>${ tags }</L><BR>`;
    orderInfo += `备注：<L>${ remark }</L><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += "实付："+ total_fee/100 +"元<BR>";
    orderInfo += "下单时间："+ create_at +"<BR><BR>";
    orderInfo += "--------------------------------<BR>";
    orderInfo += `用户：${client_name}<BR>`;
    orderInfo += `电话：${((typeof client_mobile == 'string' && client_mobile.length == 11) ? client_mobile.replace(client_mobile.substring(3,7), '****') : client_mobile)}<BR>`;
    if (client_area_scope) {
      orderInfo += `区域：${client_area_scope}<BR>`;
    }
    if (client_address_detail) {
      orderInfo += `地址：${client_address_detail}<BR><BR>`;
    }
    orderInfo += "--------------------------------<BR>";
    // orderInfo += "<QR>http://weixin.qq.com/r/nxPSyo3ENdBKrcmp90aN</QR><BR><BR>";
    // 切刀
    orderInfo += "<CUT>";
    // 用户联
    orderInfo += "<CB>社有食纪 【客户联】</CB><BR>";//标题字体如需居中放大,就需要用标签套上
    orderInfo += `<CB>${shortNo}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `<CB>〓 ${use_pattern} 〓</CB><BR>`;
    orderInfo += `预约时间：<BR>`;
    orderInfo += `<CB>${appointment}</CB><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += `订单号: ${out_trade_no}<BR>`;
    orderInfo += "--------------------------------<BR>";
    for(let i = 1; i <= goodsList.length; i++){
      let goods = goodsList[i-1];
      orderInfo += `<L>${i}. `+ goods.goods_title +"</L><BR>";
      orderInfo += "<B>数量："+ goods.count+ "</B>　<BOLD>单价:"+ goods.total_fee/100+ "　总价:"+ (goods.total_fee * goods.count)/100+ "</BOLD><BR><BR>"
    }
    orderInfo += "--------------------------------<BR>";
    orderInfo += `标注：<L>${ tags }</L><BR>`;
    orderInfo += `备注：<L>${ remark }</L><BR>`;
    orderInfo += "--------------------------------<BR>";
    orderInfo += "实付："+ total_fee/100 +"元<BR>";
    orderInfo += "下单时间："+ create_at +"<BR><BR>";
    orderInfo += "--------------------------------<BR>";
    orderInfo += `用户：${client_name}<BR>`;
    orderInfo += `电话：${((typeof client_mobile == 'string' && client_mobile.length == 11) ? client_mobile.replace(client_mobile.substring(3,7), '****') : client_mobile)}<BR>`;
    if (client_area_scope) {
      orderInfo += `区域：${client_area_scope}<BR>`;
    }
    if (client_address_detail) {
      orderInfo += `地址：${client_address_detail}<BR>`;
    }
    orderInfo += "<QR>http://weixin.qq.com/r/nxPSyo3ENdBKrcmp90aN</QR><BR><BR>";
    return orderInfo;
  }

  /**
   * 支付通知处理函数
   * @param {string} queueName 
   */
  async clientPayNotifyProcess(informData) {
    const {ctx} = this;
    // 1. 获取通知参数
    const { appid, mch_id, openid, is_subscribe, total_fee, cash_fee,
      transaction_id, out_trade_no, attach, time_end } = informData;
    let isCommit = false; // 用于对【未经过事务】的阶段进行判断
    // 2. Redis 响应重复性处理
    const cacheKey = `order.client.payNotify::${out_trade_no}`;
    const cacheData = await this.getCache(cacheKey); // 若缓存不存在序列, 则从0开始计数
    if (cacheData) {
      return ctx.message.notify.pending({out_trade_no, openid, attach, time_end});
    }
    await this.setCache(cacheKey, out_trade_no, (60 * 5)); // 5分钟缓存
    // 3.获取操作模型
    const transaction = await ctx.model.transaction(); // 事务
    const sequelize = ctx.model;
    const { Order, OrderGoodsRelation, XqStore, XqSubSeller } = sequelize;
    try {
      // 4. 支付状态变更: 支付成功
      let orderstruts = null;
      if(informData.result_code === 'SUCCESS') {
        orderstruts = ORDER_STRUTS.PAYED;
      } else {
        orderstruts = ORDER_STRUTS.PAY_FAIL;
      }
      // 5. 修改订单状态: 通知状态
      const prepay_res = await Order.update({
        orderstruts, 
        historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${orderstruts}`),
        payed_at: ctx.NOW.toDatetime(),
        update_at: ctx.NOW.toDatetime(),
      }, {
        where: {
          out_trade_no, orderstruts: ORDER_STRUTS.PREPAY,
          payed_at: null, total_fee,
        },
        transaction,
      });
      const affect_rows = prepay_res[0]; // 本次操作的影响行数
      if ( affect_rows <= 0 ) {
        await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
        await transaction.rollback();
        return ctx.message.db.noAffectRows({ openid, out_trade_no, total_fee, attach, time_end }, '支付成功通知时,修改订单状态.');
      }
      // 6. 提交事务
      await transaction.commit();
      isCommit = true; // 标注事务已提交
      // 7. 支付失败, 则直接返回响应, 不进行后续操作
      if(informData.result_code !== 'SUCCESS') {
        return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
      }
      // 8. 获取订单信息
      let thisOrder = await Order.findOne({
        attribudes: ['short_no', 'appointment', 'total_fee', 'tags', 'use_pattern', 'remark', 'create_at',
          'client_name', 'client_gender', 'client_mobile', 'client_area_scope', 'client_address_detail',
          'update_at',
        ],
        where: { out_trade_no },
        include: [{
          model: OrderGoodsRelation, required: true, attribudes: ['goods_title', 'total_fee', 'count']
        }, {
          model: XqStore, required: true, attribudes: ['printer_no', 'auto_takeorder', 'delivery_state'],
        }]
      });
      if (!thisOrder) {
        return ctx.message.storeOrder.orderInvalid({ out_trade_no }, '用户支付成功, 但未查询到条件满足的订单');
      }
      /**
       * 9.自动接单流程
       * 条件1: 支付成功后, 如果商户开启自动接单, 并且订单为堂食或者自取单, 则订单状态直接变更为状态 "seller_take" (商户已接单);
       * 条件2: 支付成功后, 如果商户开启自动接单, 并且订单使用方式为"配送单", 且商家配送方式为开启"商家配送", 
       *        则订单状态直接变更为状态 "seller_take" (商户已接单);
       */
      if (thisOrder.xq_store.auto_takeorder === '1'
        && (
          (thisOrder.use_pattern === USE_PATTERN.TAKESELF || thisOrder.use_pattern === USE_PATTERN.EATIN)
          ||
          (thisOrder.use_pattern === USE_PATTERN.DELIVERY && thisOrder.xq_store.delivery_state === DELIVERY_STRUTS.SELLER)
        )
      ) {
        const seller_take_res = await Order.update({
          orderstruts: ORDER_STRUTS.SELLER_TAKE, 
          historystruts: sequelize.fn('CONCAT', sequelize.col('historystruts'), `-${ORDER_STRUTS.SELLER_TAKE}`),
          update_at: ctx.NOW.toDatetime(),
        }, {
          where: {
            out_trade_no, 
            orderstruts: ORDER_STRUTS.PAYED,
            update_at: thisOrder.update_at,
          },
          // transaction,
        });
        const seller_take_affect_rows = seller_take_res[0]; // 本次操作的影响行数
        if ( seller_take_affect_rows <= 0 ) {
          await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
          // await transaction.rollback();
          return ctx.message.db.noAffectRows({ out_trade_no, thisOrder }, '支付成功通知时, 订单在转为自取单时出错, 修改订单状态未影响行数.');
        }
      }
      // 10. 判断是否有商品, 用于发送打印机命令
      if (thisOrder.order_goods_relations) {
        thisOrder = JSON.parse(JSON.stringify(thisOrder));
        const goodsList = thisOrder.order_goods_relations;
        const { short_no, appointment, total_fee, tags, remark, use_pattern, create_at,
          client_name, client_gender, client_mobile, client_area_scope, client_address_detail,
        } = thisOrder;
        const printer_no = thisOrder.xq_store.printer_no;
        if (printer_no) {
          try {
            let use_pattern_text = '';
            switch (use_pattern) {
              case 'delivery': use_pattern_text = '骑手配送'; break;
              case 'takeself': use_pattern_text = '自取单'; break;
              case 'eatin': use_pattern_text = '堂食'; break;
              default: break;
            }
            const orderInfo = this.getPrintString({ shortNo: short_no, out_trade_no, 
              appointment: (new Calendar(appointment)).toDatetime(),
              use_pattern: use_pattern_text,
              goodsList,
              total_fee, tags, remark, 
              create_at: (new Calendar(create_at)).toDatetime(),
              client_name, client_gender, client_mobile, client_area_scope, client_address_detail,
            });
            const sn1 = printer_no;
            const print_res = await ctx.service.order.printer.printing(sn1, orderInfo);
            ctx.logger.info(`订单[${out_trade_no}]打印结果: `, print_res);
          } catch (error) {
            ctx.logger.error('订单打印时, 发生异常: ', error);
          }
        } else {
          ctx.logger.info(`订单[${out_trade_no}]打印时，发现未接入打印机设备...`);
        }
      } else {
        ctx.logger.error('订单打印前, 获取订单信息失败: ', thisOrder);
      }
      // 11. 通知商户, 模板消息
      setTimeout(async () => {
        // 查询订单数据
        const include = [{
          model: OrderGoodsRelation, required: true, attribudes: ['goods_title', 'count']
        }, {
          model: XqStore, required: true, attribudes: ['printer_no'], include: [{
            model: XqSubSeller, where: { struts: '1' },
          }],
        }];
        const orderInfo = JSON.parse( JSON.stringify(await Order.findOne({ include, where: {out_trade_no} })) );
        
        if (!orderInfo) return ctx.logger.error('订单支付通知时的订单信息 orderInfo: ', orderInfo);
        orderInfo.goods_title = orderInfo.order_goods_relations.map( g => `${g.goods_title} x ${g.count}个`).join('，');
        // 获取公众号的 access_token
        const gzh_access_token = await this.getOfficialAccessToken(out_trade_no);
        // attach 是用户的预订单时间
        let appointment = ctx.NOW.toDatetime();
        if (attach) {
          appointment = attach;
        }
        // 向用户发送模板消息
        const payTemplateText = await ctx.service.order.tmessage.payMessageForUser({
          openid, orderInfo, total_fee, time_end: appointment, gzh_access_token
        });
        ctx.logger.info('【payInform】用户支付通知结果 => ', JSON.stringify(payTemplateText));
        // 向商户下的所有操作员发送订单消息
        const templateSellerText = await ctx.service.order.tmessage.payMessageForSeller({ 
          orderInfo, total_fee, time_end: appointment, gzh_access_token
        });
        ctx.logger.info('【payInform】商户支付通知结果 => ', JSON.stringify(templateSellerText));
        // 如果是配送单, 则给骑手发送通知
        if (orderInfo.use_pattern === 'delivery') {
          const templateKnightText = await ctx.service.order.tmessage.payMessageForKnight({ 
            orderInfo, total_fee, time_end: appointment, gzh_access_token
          });
          ctx.logger.info('【payInform】骑手支付通知结果 => ', JSON.stringify(templateKnightText));
        }
        
      }, 0);

      return;
    } catch (error) {
      await this.setCache(cacheKey, null, (60 * 5)); // 清缓存
      if (!isCommit) {
        await transaction.rollback();
      }
      return ctx.message.exception(err);
    }
  } // end: clientPayNotifyProcess
  
}

module.exports = NotifyprocessService;
