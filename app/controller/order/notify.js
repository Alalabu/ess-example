'use strict';
const xml2js = require('xml2js').parseString;
const Controller = require('egg').Controller;

class NotifyController extends Controller {

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
    const informRes = await ctx.service.order.notify.payNotify(informData);
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

}

module.exports = NotifyController;
