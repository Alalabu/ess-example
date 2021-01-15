'use strict';
const _ = require('lodash');
const xml2js = require('xml2js');
const request = require('request');
const fs = require('fs');
const md5 = require('blueimp-md5');
const crypto = require('crypto');
const BaseService = require('../base/base');

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

/**
 * 支付相关签名
 * @param {Object} data 
 */
const paySign = (data, mch_secret) => {
  const paramKeys = Object.keys(data);
  paramKeys.sort();
  const string1 = paramKeys.map((k) => `${k}=${data[k]}`).join('&');
  // console.log('签名内容: ', string1);
  return md5(`${string1}&key=${mch_secret}`).toUpperCase();
};
/**
 * 预支付二次签名
 * 获取需要返回前端的 预支付 参数
 * @param {*} appid 
 * @param {*} prepayId 
 * @param {*} tradeId 
 */
const getPrepayParams = ({ appid, mch_secret, prepayId, tradeId, nonceStr, timeStamp }) => {
  const packageStr = 'prepay_id=' + prepayId;
  const paySignResult = paySign({
    appId: appid, timeStamp, nonceStr, signType: 'MD5',
    package: packageStr }, mch_secret);
  // 前端需要的所有数据, 都从这里返回过去
  return {
    nonceStr, timeStamp,
    package: packageStr,
    paySign: paySignResult,
    signType: 'MD5', tradeId,
  };
};
/**
 * 发送微信支付相关业务请求
 */
const sendWechatRequest = async ({url, queryData, mch_id, mch_path}) => {
  const queryResBuffer = await new Promise((resolve, reject) => {
    const options = { url, method: 'POST', body: queryData };
    if (mch_id && mch_path) {
      options.agentOptions = {
        pfx: fs.readFileSync(mch_path), // './cert/apiclient_cert.p12'
        passphrase: mch_id,
      };
    }
    // console.log(`开始发送微信支付请求[queryData]...`, queryData);
    request( options, function(err, response, body) {
      resolve({ err, response, body });
    });
  });
  const queryRes = decoder.write(queryResBuffer.body);
  // console.log('====> 预支付订单生成结果: ', queryRes);
  const xmlParser = new xml2js.Parser({ explicitArray: false });
  return new Promise((resolve, reject) => {
    xmlParser.parseString(queryRes, (err, success) => {
      if (err) reject(err);
      resolve(success.xml);
    });
  });
}
// 预支付请求 url
const PREPAYURL = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
// 退费url
const REFUNDURL = 'https://api.mch.weixin.qq.com/secapi/pay/refund';
// 企业付款至商户零钱 url
const TRANSFERSURL = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers';
// 用于解析 xml 文本
const XMLBuilder = new xml2js.Builder({
  rootName: 'xml',
  headless: true,
  renderOpts: {
    pretty: false,
  },
});

/**
 * 统一支付功能 管理
 */
class UnifyService extends BaseService {
  /**
   * 统一预支付订单
   */
  async prepay({appid, mch_id, mch_path, mch_secret, device_info, body, detail, attach, out_trade_no, total_fee,
    spbill_create_ip, openid, notify_url}) {
      const { ctx } = this;

      ctx.logger.info('统一预支付参数:', JSON.stringify({appid, mch_id, mch_path, mch_secret, device_info, body, detail, attach, out_trade_no, total_fee,
        spbill_create_ip, openid, notify_url}));

      const nonce_str = ctx.getNonceStr(16); // 随机字符串
      const pay_params = _.omitBy({appid, mch_id, device_info, body, detail, attach, out_trade_no, total_fee,
        spbill_create_ip, openid, notify_url}, _.isNil);

      ctx.logger.info('[过滤后]统一预支付参数:', JSON.stringify(pay_params));

      pay_params.nonce_str = nonce_str; // 随机字符串
      pay_params.trade_type = 'JSAPI';
      pay_params.sign = paySign(pay_params, mch_secret);

      ctx.logger.info('[最终]统一预支付参数:', JSON.stringify(pay_params));

      const queryData = XMLBuilder.buildObject(pay_params);
      const url = PREPAYURL;
      const perpay_result = await sendWechatRequest({url, queryData, mch_id, mch_path});

      const return_code = perpay_result.return_code;
      if(return_code === "SUCCESS") {
				const result_code = perpay_result.result_code;
        if (result_code === "SUCCESS") {
					const prepay_id = perpay_result.prepay_id;
          // 预支付结果正常
          const prepayParams = getPrepayParams({
            appid, 
            mch_secret,
            prepayId: prepay_id,
            tradeId: out_trade_no,
            nonceStr: nonce_str, // ctx.getNonceStr(16),
            timeStamp: `${ctx.timeStamp}`,
          });
          return ctx.message.success(prepayParams);
        }
        return ctx.message.prepay.resultFail(perpay_result);
      }
      return ctx.message.prepay.returnFail(perpay_result);
  }

  /**
   * 统一退费流程
   */
  async refund({appid, mch_id, mch_path, mch_secret, out_trade_no, out_refund_no, total_fee, refund_fee, notify_url}) {
    const {ctx} = this;
    const refund_params = _.omitBy({appid, mch_id, out_trade_no, out_refund_no, total_fee, refund_fee}, _.isNil);
    refund_params.nonce_str = ctx.getNonceStr(16); // 随机字符串
    refund_params.notify_url = notify_url;
    refund_params.sign = paySign(refund_params, mch_secret);
    const queryData = XMLBuilder.buildObject(refund_params);
    const url = REFUNDURL;
    const refund_result = await sendWechatRequest({url, queryData, mch_id, mch_path});
    // 解析退费结果
		if(refund_result.return_code === "FAIL") {
      return ctx.message.refund.returnFail(refund_result);
    }
    if(refund_result.result_code === "FAIL") {
      return ctx.message.refund.resultFail(refund_result);
    }
    return ctx.message.success(refund_result);
  }

  /**
   * 加密信息请用商户秘钥进行解密
   * 解密步骤如下：
   * （1）对加密串A做 base64 解码，得到加密串B
   * （2）对商户key做md5，得到32位小写key* ( key设置路径：微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置 )
   * （3）用key*对加密串B做 AES-256-ECB 解密（PKCS7Padding）
   * @param {String} req_info 1024
   */
  refundDecode(req_info, mch_secret) {
    // 1. base64
    const encryptedData = new Buffer(req_info, 'base64');
    // 2. md5
    const md5 = crypto.createHash('md5');
    const _key = md5.update(mch_secret).digest('hex');
    // 3. AES-256-ECB
    const iv = '';
    const decipher = crypto.createDecipheriv('aes-256-ecb', _key, iv);
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedData, 'base64', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
  }

  /**
   * 关闭订单
   * @param {String} out_trade_no 订单号
   */
  async orderClose({appid, mch_id, mch_secret, out_trade_no}) {
    /**
     * 以下情况需要调用关单接口：商户订单支付失败需要生成新单号重新发起支付，
     * 要对原订单号调用关单，避免重复支付；系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
     * 注意：订单生成后不能马上调用关单接口，最短调用时间间隔为5分钟。
     */
    const {ctx} = this;
    const order_close_url = 'https://api.mch.weixin.qq.com/pay/closeorder';
    const close_params = { appid, mch_id, out_trade_no };
    close_params.nonce_str = ctx.getNonceStr(16); // 随机字符串
    close_params.sign = paySign(close_params, mch_secret);
    const queryData = XMLBuilder.buildObject(close_params);
    const close_result = await sendWechatRequest({url: order_close_url, queryData});
    // 解析退费结果
		if(close_result.return_code === "FAIL") {
      return ctx.message.closeOrder.returnFail(close_result);
    }
    if(close_result.result_code === "FAIL") {
      return ctx.message.closeOrder.resultFail(close_result);
    }
    return ctx.message.success(close_result);
  }

  /**
   * 查询订单状态
   * @param {*} out_trade_no 订单号
   */
  async queryOrderquery({appid, mch_id, mch_secret, out_trade_no}) {
    /**
     * 该接口提供所有微信支付订单的查询，商户可以通过查询订单接口主动查询订单状态，完成下一步的业务逻辑。
     * 需要调用查询接口的情况：
     * ◆ 当商户后台、网络、服务器等出现异常，商户系统最终未接收到支付通知；
     * ◆ 调用支付接口后，返回系统错误或未知交易状态情况；
     * ◆ 调用刷卡支付API，返回USERPAYING的状态；
     * ◆ 调用关单或撤销接口API之前，需确认支付状态；
     */
    const {ctx} = this;
    const order_query_url = 'https://api.mch.weixin.qq.com/pay/orderquery';
    const qo_params = { appid, mch_id, out_trade_no };
    qo_params.nonce_str = ctx.getNonceStr(16); // 随机字符串
    qo_params.sign = paySign(qo_params, mch_secret);
    const queryData = XMLBuilder.buildObject(qo_params);
    const qo_result = await sendWechatRequest({url: order_query_url, queryData});
    // 解析退费结果
		if(qo_result.return_code === "FAIL") {
      return ctx.message.queryOrder.returnFail(qo_result);
    }
    if(qo_result.result_code === "FAIL") {
      return ctx.message.queryOrder.resultFail(qo_result);
    }
    return ctx.message.success(qo_result);
  }

  /**
   * 企业付款至商户零钱
   */
  async transfers({mch_appid, mch_id, mch_path, mch_secret, partner_trade_no, openid, check_name = 'NO_CHECK',
      amount, desc}) {
    const {ctx} = this;
    const transfers_params = _.omitBy({mch_appid, mchid: mch_id, partner_trade_no, openid, check_name, amount, desc}, _.isNil);
    transfers_params.nonce_str = ctx.getNonceStr(16); // 随机字符串
    transfers_params.sign = paySign(transfers_params, mch_secret);
    const queryData = XMLBuilder.buildObject(transfers_params);
    const url = TRANSFERSURL;
    const transfers_result = await sendWechatRequest({url, queryData, mch_id, mch_path});
    // 解析 企业付款至商户零钱 结果
		if(transfers_result.return_code !== "SUCCESS") {
      return ctx.message.transfers.returnFail(transfers_result);
    }
    if(transfers_result.result_code !== "SUCCESS") {
      return ctx.message.transfers.resultFail(transfers_result);
    }
    return ctx.message.success(transfers_result);
  }

}

module.exports = UnifyService;
