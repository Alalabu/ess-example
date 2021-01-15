'use strict';
/**
 * 模型 OrderComment 的 Service
*/

// const {Calendar, CalendarTypes} = require('calendar2');
const Controller = require('egg').Controller;
const _ = require('lodash');
const baidu = require('../../util/baidu-api');
const BaseService = require('../base/base');

class OrderCommentService extends BaseService {
	constructor(ctx) {
		super(ctx);
		this.proxy = ctx.app.model.OrderComment;
	}

	// 用于查询单个模型数据的方法
	async findOne(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment} = sequelize;
		let {id, out_trade_no} = option;
		const include = [];
		const where = _.omitBy(option, _.isNil);
		const info = await OrderComment.findOne({ where });
		return ctx.message.success(info);
	}

	// 用于查询所有模型数据的方法
	async findAll(option) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment, XqClient, XqStore} = sequelize;
		let {store_id, client_id, status, pageIndex, limit} = option;
		limit = (_.isInteger(limit) && limit > 0) ? Number(limit): 20;
		pageIndex = (_.isInteger(pageIndex) && pageIndex > 0) ? Number(pageIndex): 1;
		const offset = (Number(pageIndex) - 1) * limit;
		const where = _.omitBy({store_id, client_id, status}, _.isNil);
		const orderby = [['create_at', 'DESC']];
		const include = [];
		if (store_id) {
			include.push({ model:XqClient, attributes: ['username', 'logourl', 'gender'] });
		} else if (client_id) {
			include.push({ model:XqStore, attributes: ['store_name', 'logourl', 'address'] });
		}
		const list = await OrderComment.findAll({where, order: orderby, offset, limit, include });
		return ctx.message.success(list);
	}

	/**
	 * 查询评论的数量
	 * @param {*} param0 
	 */
	async count({store_id, client_id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment} = sequelize;
		const whereby = {};
		if (store_id) {
			whereby.store_id = store_id;
		} else if (client_id) {
			whereby.client_id = client_id;
		} else {
			return ctx.message.exception('未明确查询目标');
		}
		const count_num = await OrderComment.count({ where: whereby });
		return ctx.message.success(count_num);
	}

	/**
   * 订单评论队列
   * @param {string} queueName 
   */
  async listenQueue(queueName) {
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
        await ctx.service.order.orderComment.addQueueComment(queueMsg);
      } else {
        return null;
      }
    }
	} // end: payNotifyQueue
	
	/**
	 * 执行队列数据
	 * @param {*} queueMsg 
	 */
	async addQueueComment(queueMsg) {
		// 1. 获取队列参数
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment, XqStore, Order} = sequelize;
		// 开启一个事务
		const transaction = await ctx.model.transaction();
		let {store_id, client_id, out_trade_no, reply_id, pic_url, score, content, is_anonymity} = queueMsg;
		let status = '1';
		try{
			// 1. 审核文字评论内容
			const text_ck_res = await baidu.textCensor(content);
			if (text_ck_res.conclusionType !== 1) {
				// 订单评论状态重置为: 审核中 -> 否
				await Order.update({is_comment: '0'}, { where: {out_trade_no}, transaction });
				await transaction.commit();
				// 文字内容不符合规定
				return ctx.logger.error('评论文本内容不符合规定: ', JSON.stringify(queueMsg));
			}
			// 2. 审核图片评论内容
			if (pic_url) {
				const img_ck_res = await baidu.imageUrlCensor(pic_url);
				if (img_ck_res.conclusionType !== 1) {
					// 订单评论状态重置为: 审核中 -> 否
					await Order.update({is_comment: '0'}, { where: {out_trade_no}, transaction });
					await transaction.commit();
					// 文字内容不符合规定
					return ctx.logger.error('评论图片内容不符合规定: ', JSON.stringify(queueMsg));
				}
			}
			// 3. 新增评论内容
			let inputArgs = _.omitBy({store_id, client_id, out_trade_no, reply_id, pic_url, score, content, is_anonymity, status}, _.isNil);
			inputArgs.id = ctx.uuid32;
			inputArgs.create_at = ctx.NOW.toDatetime();
			console.log('【add orderComment】 ： ', inputArgs);
			const orderCommentInput = await OrderComment.create(inputArgs, { transaction });
			// 4. 修改商户总分以及评论数量
			const ups = await XqStore.update({
				total_score: sequelize.literal(`total_score + ${score}`),
				comment_count: sequelize.literal(`comment_count + 1`),
			}, {
				where: {id: store_id},
				transaction,
			});
			// 5. 修改订单的评论状态
			const upo = await Order.update({is_comment: '2'}, { where: {out_trade_no} });
			// 6. 提交事务
			await transaction.commit();
			return ctx.message.success(orderCommentInput);
		}catch(err) {
			await transaction.rollback();
			return ctx.message.exception(err);
		}
	}

	// 新增模型的方法
	async add(orderComment) {
		const {ctx} = this;
		try {
			// 1. 订单评论的审核状态改变: is_comment = '1' (审核中)
			const sequelize = ctx.model;
			const {Order} = sequelize;
			await Order.update({is_comment: '1'}, { where: {out_trade_no: orderComment.out_trade_no} });
			// 1. 设置队列名, 及获取参数
			const queueName = `client.comment`;
			// 2. 写入消息队列
			const ch = await this.app.amqplib.createChannel();
			await ch.assertQueue(queueName, { durable: false });
			await ch.sendToQueue(queueName, Buffer.from(JSON.stringify(orderComment)));
			await ch.close();
			// 3. 返回审核信息
			return ctx.message.success('ok');
		} catch (error) {
			return ctx.message.exception(error);
		}
		
	}

	// 修改模型的方法
	async update(orderComment) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		const {id, pic_url, score, content, is_anonymity, status} = orderComment;
		let msg = null, result = -1;
		try{
			result = await OrderComment.update( _.omitBy({pic_url, score, content, is_anonymity, status}, _.isNil) , { where: { id } });
			// await transaction.commit();
			const affected_rows_count = result[0];
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}

	// 删除模型的方法
	async remove({id}) {
		const {ctx} = this;
		const sequelize = ctx.model;
		const {OrderComment} = sequelize;
		// 开启一个事务
		// const transaction = await ctx.model.transaction();
		let msg = null, result = -1;
		try{
			result = await OrderComment.destroy({where: {id}});
			const affected_rows_count = result;
			// await transaction.commit();
			if (affected_rows_count > 0)
				msg = ctx.message.success();
			else
				msg = ctx.message.result.noAffect();
		}catch(err) {
			// await transaction.rollback();
			return ctx.message.exception(err);
		}
		return msg;
	}

}
module.exports = OrderCommentService;
