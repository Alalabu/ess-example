'use strict';
const uuidv1 = require('uuid/v1');
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class NotifyqueueService extends BaseService {

  /**
   * 支付通知
   * @param {string} queueName 
   */
  async clientPayNotifyQueue(queueName) {
    const {ctx} = this;
    while(1){
      const ch = await this.app.amqplib.createChannel();
      await ch.assertQueue(queueName, { durable: false });
      const msg = await new Promise(resolve => ch.consume(queueName, msg => resolve(msg)));
      if (msg !== null) {
        ch.ack(msg);
        await ch.close();
        // 业务
        const queueMsg = JSON.parse(msg.content.toString());
        await ctx.service.order.notifyprocess.clientPayNotifyProcess(queueMsg);
      } else {
        return null;
      }
    }
  } // end: payNotifyQueue
  
}

module.exports = NotifyqueueService;
