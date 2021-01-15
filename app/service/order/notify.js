'use strict';
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const xml2js = require('xml2js');
const BaseService = require('../base/base');

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
class NotifyService extends BaseService {

  /**
   * 支付通知
   * @param {*} informData 
   */
  async payNotify(informData) {
    const {ctx} = this;
    // 1. 校验是否成功接收通知
    if(informData.return_code !== 'SUCCESS') {
      return ctx.message.notify.fail(informData, '用户支付');
    }
    try {
      const queueName = `client.payNotify`;
      // 1. 写入消息队列
      const ch = await this.app.amqplib.createChannel();
      await ch.assertQueue(queueName, { durable: false });
      await ch.sendToQueue(queueName, Buffer.from(JSON.stringify(informData)));
      await ch.close();
      return XMLBuilder.buildObject({ return_code: 'SUCCESS', return_msg: 'OK' });
    } catch (error) {
      ctx.logger.error(error);
    }
  }


}

module.exports = NotifyService;
