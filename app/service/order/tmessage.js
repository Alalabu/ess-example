'use strict';
const _ = require('lodash');
const BaseService = require('../base/base');
const ORDER_STRUTS = require('../../enums/order_struts');

/**
 * 主要负责微信通知的模板消息
 */
class TmessageService extends BaseService {

  /**
   * 通过 unionid 获取用户的公众号 openid
   * @param {*} unionid 
   */
  async getOfficialOpenid(unionid) {
    const { ctx } = this;
    const header = {
      authorization: ctx.generateToken({ 
        params: { unionid },
        secret: ctx.app.config.jwt.secret,
        expiresIn: (5 * 60 * 60)
      })
    };
    const secret = '1e145f108f4711eabe3100ff9846b53f';
    const options = {
      key: '1e145f0a8f4711eabe3100ff9846b53f',
      timeStamp: ctx.timeStamp,
      nonceStr: ctx.getNonceStr(16),
      unionid: unionid,
    };
    options.sign = ctx.parseSign(options, secret);
    // 通过 unionid 换取公众号用户的 openid
    // ctx.logger.info('【支付通知】准备换取公众号 openid, options = ', options);
    // const gzhuser_result = await ctx.app.seneca("wechat", "official/user", options);
    const gzhuser_result = await ctx.curl('https://g.she-u.cn/wechat/official/user', {
      dataType: 'json', method: 'POST', data: options, headers: header
    });
    if(!gzhuser_result?.data || gzhuser_result.data.err) {
      ctx.logger.error('【支付通知】准备换取公众号失败:', gzhuser_result);
    }
    // ctx.logger.info('【支付通知】换取公众号 openid 成功: ', gzhuser_result);
    return gzhuser_result.data.data.openid;
  }

  /**
   * 支付成功: 向用户发送的公众号订阅模板消息
   * @param {*} config
   */
  async payMessageForUser({ openid, orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      const { XqClient } = ctx.model;
      const client = await XqClient.findOne({ where: { openid }, raw: true });
      if (!client || !client.unionid) {
        return ctx.logger.error('【payInform Template Error】(!client || !client.unionid): ', client);
      }
      // 将 unionid 转换为公众号的 openid
      const touserOpenid = await this.getOfficialOpenid(client.unionid);

      // 获取订单信息
      const { short_no, store_name, goods_title } = orderInfo;
      // 编辑公众号消息模板
      const post_data = {
        touser: touserOpenid,
        template_id: 'MxmuDRPbuBGVZmD9mbGNeLwZBoyAEuIo5xNes2Ah1wA',
        // miniprogram: {
        //   appid: 'wxcf0228511283435a',
        //   pagepath: 'pages/guide/guide',
        // },
        data: {
          first: { value: '支付成功！', color: '#173177' },
          keyword1: { value: store_name, color: '#173177' },
          keyword2: { value: short_no, color: '#DD4F42' },
          keyword3: { value: goods_title, color: '#353535' },
          keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
          keyword5: { value: time_end, color: '#173177' },
          remark: { value: '您可以通过订单编号识别您购买的商品哦~', color: '#173177' },
        },
      };
      const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
      ctx.logger.info('【公众号消息模板】: ', wechatTemplateResult);
      
      return wechatTemplateResult;
    } catch (error) {
      ctx.logger.error('【payInform Template sendPaySuccessMessageForUser Exception】: ', error);
    }
  }

  /**
   * 订单状态变更: 向用户发送的公众号订阅模板消息
   * @param {*} config
   */
  async orderStrutsChangeMessageForUser({ clint_id, store_name, orderstruts, total_fee, time_end, closing, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      const { XqClient } = ctx.model;
      const client = await XqClient.findOne({ where: { id: clint_id }, raw: true });
      if (!client || !client.unionid) {
        ctx.logger.info('【Template Message】(!client || !client.unionid): ', client);
        return '用户的 unionid 不存在!';
      }
      // 将 unionid 转换为公众号的 openid
      const touserOpenid = await this.getOfficialOpenid(client.unionid);

      // 获取订单信息
      // const { short_no, store_name, orderstruts } = orderInfo;
      // 编辑公众号消息模板
      const post_data = {
        touser: touserOpenid,
        template_id: '6y9tkITt0FQD_3Mlwkvkug4QSChzKuBT_K40hTTjKI0',
        // miniprogram: {
        //   appid: 'wxcf0228511283435a',
        //   pagepath: 'pages/guide/guide',
        // },
        data: {
          first: { value: `您好，您在 ${store_name} 的订单状态已变化！`, color: '#173177' },
          keyword1: { value: `￥${total_fee / 100}`, color: '#173177' },
          keyword2: { value: time_end, color: '#173177' },
          keyword3: { value: ORDER_STRUTS.text( orderstruts ), color: '#353535' }, 
          // keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
          // keyword5: { value: time_end, color: '#173177' },
          remark: { value: closing, color: '#173177' },
        },
      };
      const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
      ctx.logger.info('【公众号消息模板】: ', wechatTemplateResult);
      
      return wechatTemplateResult;
    } catch (error) {
      ctx.logger.error('【payInform Template sendPaySuccessMessageForUser Exception】: ', error);
    }
  }

  /**
   * 用户规则: 中奖结果通知
   * @param {*} config
   */
  async giftMessageForUser({ unionid, client_name, rebate_title, total_fee, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 将 unionid 转换为公众号的 openid
      const touserOpenid = await this.getOfficialOpenid(unionid);

      // 获取订单信息
      const now = ctx.NOW.toDatetime();
      // 编辑公众号消息模板
      const post_data = {
        touser: touserOpenid,
        template_id: 'sgl8QvjqRCkV4S3Q8MdMnvc4bNhARCq4S3HTbSFgRPA',
        miniprogram: {
          appid: 'wxcf0228511283435a',
          pagepath: 'pages/guide/guide',
        },
        data: {
          first: { value: `恭喜哦亲爱的 ${client_name} ，您在参与的社有活动中幸运胜出！`, color: '#353535' },
          keyword1: { value: rebate_title, color: '#173177' }, // 参与活动
          keyword2: { value: `￥${total_fee / 100} 元`, color: '#ef115f' }, // 奖品名称 
          keyword3: { value: now, color: '#353535' }, // 中奖时间
          keyword4: { value: now, color: '#353535' }, // 兑奖时间
          // keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
          // keyword5: { value: time_end, color: '#173177' },
          remark: { value: '请及时查收您的奖品到账情况，感谢您的积极参与，我们会努力越做越好！', color: '#353535' },
        },
      };
      const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
      ctx.logger.info('【公众号消息模板】: ', wechatTemplateResult.data);
      
      return wechatTemplateResult;
    } catch (error) {
      ctx.logger.error('【payInform Template sendPaySuccessMessageForUser Exception】: ', error);
    }
  }

  /**
   * 支付成功: 向商户发送公众号订阅模板消息
   * @param {*} config
   */
  async payMessageForSeller({ orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 查询订单数据
      const { short_no, use_pattern, remark, tags, goods_title, xq_store } = orderInfo;
      // 订单状态区分
      let order_pattern = '';
      switch (use_pattern) {
        case 'delivery': order_pattern = '骑手取单'; break;
        case 'takeself': order_pattern = '自取单'; break;
        case 'eatin': order_pattern = '堂食'; break;
        default:
          break;
      }
      const { xq_sub_sellers } = xq_store; // 商户下的操作员
      for (let i = 0; i < xq_sub_sellers.length; i++) {
        const seller = xq_sub_sellers[i];
        if (seller.unionid) {
          const seller_offic_openid = await this.getOfficialOpenid(seller.unionid);
          if (!seller_offic_openid) continue; // 该用户的公众号 openid 不存在时则跳过
          // 编辑模板
          const post_data = {
            touser: seller_offic_openid,
            template_id: 'yuSScC1xsQ4XBtWJKHjFO2TXSlC8qTVLPnOatT0s2YU',
            // miniprogram: {
            //   appid: 'wxca2ddba40596d5de',
            //   pagepath: 'pages/loading/loading',
            // },
            data: {
              first: { value: '商家收到新的用户订单！', color: '#173177' },
              keyword1: { value: goods_title, color: '#353535' },
              keyword2: { value: short_no, color: '#DD4F42' },
              keyword3: { value: `￥${total_fee / 100}`, color: '#173177' },
              keyword4: { value: time_end, color: '#173177' },
              keyword5: { value: order_pattern, color: '#173177' },
              remark: { value: `标签选择: ${tags} \n备注: ${remark}`, color: '#173177' },
            },
          };
          const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
          ctx.logger.info('【payInform Template sendPaySuccessMessageForUser】: ', wechatTemplateResult);
        }
      }
      ctx.logger.info('【发送商户订单模板完成】: ', xq_sub_sellers);
      return;
    } catch (error) {
      ctx.logger.error('【发送商户订单模板 Exception】: ', error);
    }
  }

  /**
   * 退款成功: 向用户发送的公众号订阅模板消息
   * @param {*} config
   */
  async refundMessageForUser({ openid, orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      const { XqClient } = ctx.model;
      const client = await XqClient.findOne({ where: { openid }, raw: true });
      if (!client || !client.unionid) {
        return ctx.logger.error('【用户退费模板消息】(!client || !client.unionid): ', client);
      }
      // 将 unionid 转换为公众号的 openid
      const touserOpenid = await this.getOfficialOpenid(client.unionid);

      // 获取订单信息
      const { short_no, store_name, goods_title } = orderInfo;
      // 编辑公众号消息模板
      const post_data = {
        touser: touserOpenid,
        template_id: 'Uv0d7BhcehFE_ZxHNm46TKKR1-2xv3dKwTssC27zRUo',
        // miniprogram: {
        //   appid: 'wxcf0228511283435a',
        //   pagepath: 'pages/guide/guide',
        // },
        data: {
          first: { value: '退费成功', color: '#173177' },
          keyword1: { value: short_no, color: '#DD4F42' },
          keyword2: { value: store_name, color: '#353535' },
          keyword3: { value: goods_title, color: '#173177' },
          keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
          keyword5: { value: time_end, color: '#173177' },
          remark: { value: '欢迎您下次继续选购本店哦，爱你~', color: '#173177' },
        },
      };
      const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
      ctx.logger.info('【用户退费模板消息】: ', wechatTemplateResult);
      
      return wechatTemplateResult;
    } catch (error) {
      ctx.logger.error('【用户退费模板消息】Error: ', error);
    }
  }

  /**
   * 退款成功: 向商户发送公众号订阅模板消息
   * @param {*} config
   */
  async refundMessageForSeller({ orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 查询订单数据
      const { short_no, store_name, goods_title, xq_store } = orderInfo;
      const { xq_sub_sellers } = xq_store; // 商户下的操作员
      for (let i = 0; i < xq_sub_sellers.length; i++) {
        const seller = xq_sub_sellers[i];
        if (seller.unionid) {
          const seller_offic_openid = await this.getOfficialOpenid(seller.unionid);
          if (!seller_offic_openid) continue; // 该用户的公众号 openid 不存在时则跳过
          // 编辑模板
          const post_data = {
            touser: seller_offic_openid,
            template_id: 'Uv0d7BhcehFE_ZxHNm46TKKR1-2xv3dKwTssC27zRUo',
            // miniprogram: {
            //   appid: 'wxca2ddba40596d5de',
            //   pagepath: 'pages/guide/guide',
            // },
            data: {
              first: { value: '用户已退单！', color: '#173177' },
              keyword1: { value: short_no, color: '#DD4F42' },
              keyword2: { value: store_name, color: '#353535' },
              keyword3: { value: goods_title, color: '#173177' },
              keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
              keyword5: { value: time_end, color: '#173177' },
              remark: { value: '确认接单之前，用户进行了退款操作', color: '#173177' },
            },
          };
          const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
          ctx.logger.info('【退费向商户发送模板消息】: ', wechatTemplateResult);
        }
      }
      ctx.logger.info('【退费向商户发送模板消息】: ', xq_sub_sellers);
      return;
    } catch (error) {
      ctx.logger.error('【退费向商户发送模板消息 Exception】: ', error);
    }
  }

  /**
   * 退款成功: 向骑手发送公众号订阅模板消息
   * @param {*} config
   */
  async refundMessageForKnight({ orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 查询订单数据
      const { short_no, store_name, area_id, goods_title, xq_store } = orderInfo;
      // 查询商圈下所有的骑手
      const sequelize = ctx.model;
      const { XqKnight } = sequelize;
      const knights = await XqKnight.findAll({ where: {area_id}, raw: true });
      if (!Array.isArray(knights)) throw '商圈' + area_id + '没有任何骑手';

      for (let i = 0; i < knights.length; i++) {
        const k = knights[i];
        if (k.unionid) {
          const seller_offic_openid = await this.getOfficialOpenid(k.unionid);
          if (!seller_offic_openid) continue; // 该用户的公众号 openid 不存在时则跳过
          // 编辑模板
          const post_data = {
            touser: seller_offic_openid,
            template_id: 'Uv0d7BhcehFE_ZxHNm46TKKR1-2xv3dKwTssC27zRUo',
            // miniprogram: {
            //   appid: 'wxca2ddba40596d5de',
            //   pagepath: 'pages/guide/guide',
            // },
            data: {
              first: { value: '用户已退单！', color: '#173177' },
              keyword1: { value: short_no, color: '#DD4F42' },
              keyword2: { value: store_name, color: '#353535' },
              keyword3: { value: goods_title, color: '#173177' },
              keyword4: { value: `￥${total_fee / 100}`, color: '#173177' },
              keyword5: { value: time_end, color: '#173177' },
              remark: { value: '确认接单之前，用户进行了退款操作', color: '#173177' },
            },
          };
          const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
          ctx.logger.info('【退费向商户发送模板消息】: ', wechatTemplateResult);
        }
      }
      ctx.logger.info('【退费向商户发送模板消息】: ', knights.map(k=>k.username).join(','));
      return;
    } catch (error) {
      ctx.logger.error('【退费向商户发送模板消息 Exception】: ', error);
    }
  }

  /**
   * 支付成功: 向商圈内所有骑手发送公众号订阅模板消息
   * @param {*} config
   */
  async payMessageForKnight({ orderInfo, total_fee, time_end, gzh_access_token }) {
    const { ctx } = this;
    // 将用户小程序中的openid转换为公众号的openid
    try {
      // 查询订单数据
      const { short_no, store_name, area_id, goods_title, xq_store } = orderInfo;
      // const { xq_sub_sellers } = xq_store; // 商户下的操作员
      // 查询商圈下所有的骑手
      const sequelize = ctx.model;
      const { XqKnight } = sequelize;
      const knights = await XqKnight.findAll({ where: {area_id}, raw: true });
      if (!Array.isArray(knights)) throw '商圈' + area_id + '没有任何骑手';
      // 遍历给骑手发送通知
      for (let i = 0; i < knights.length; i++) {
        const k = knights[i];
        if (k.unionid) {
          const seller_offic_openid = await this.getOfficialOpenid(k.unionid);
          if (!seller_offic_openid) continue; // 该用户的公众号 openid 不存在时则跳过
          // 编辑模板
          const post_data = {
            touser: seller_offic_openid,
            template_id: 'MqC4AaWuYAJRbCrsE_L4bOup1AQXFcHXk7-SDHSo2ns',
            // miniprogram: {
            //   appid: 'wxca2ddba40596d5de',
            //   pagepath: 'pages/loading/loading',
            // },
            data: {
              first: { value: '新的社有订单！', color: '#173177' },
              keyword1: { value: goods_title, color: '#353535' }, // 订单来源
              keyword2: { value: store_name, color: '#DD4F42' }, // 商家信息
              keyword3: { value: `订单号 - ${short_no}`, color: '#173177' }, // 顾客信息
              keyword4: { value: `￥${total_fee / 100}`, color: '#173177' }, // 下单时间及金额
              keyword5: { value: `${time_end}`, color: '#DD4F42' }, // 配送时间
              remark: { value: '请尽快送达客户的商品哦~', color: '#173177' }, // 备注
            },
          };
          const wechatTemplateResult = await this.sendTemplate(gzh_access_token, post_data); // 发送模板消息
          ctx.logger.info('【payInform Template sendPaySuccessMessageForKnight】: ', wechatTemplateResult);
        }
      }
      ctx.logger.info('【发送骑手订单模板完成】: ', knights.map(k=>k.username).join(','));
      return;
    } catch (error) {
      ctx.logger.error('【发送骑手订单模板 Exception】: ', error);
    }
  }

  /**
   * 发送 公众号 模板消息
   * @param {*} access_token 
   * @param {*} post_data 
   */
  async sendTemplate(access_token, post_data) {
    const { ctx } = this;
    // 发送消息模板
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
    return await ctx.curl(url, {
      dataType: 'json',
      method: 'POST',
      data: JSON.stringify(post_data),
    });
  }
}

module.exports = TmessageService;
