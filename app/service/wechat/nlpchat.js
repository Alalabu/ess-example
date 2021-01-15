'use strict';
const crypto = require('crypto');
const BaseService = require('../base/base');

// interface NlpchatText {
//   app_id: number;     // 应用标识（AppId）
//   time_stamp: number; // 请求时间戳（秒级）
//   nonce_str: string;  // 随机字符串
//   sign?: string;       // 签名信息
//   session: string;    // 会话标识（应用内唯一）
//   question: string;   // 用户输入的聊天内容
// }

const appid = 2126695028;
const appkey = 'EKwNNDLtJUYq25qW';

const getNonceStr = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const getSign = (session, question) => {
  // 1. 拼接请求对象 : NlpchatText
  const reqData = {
    app_id: appid,
    time_stamp: Number(`${(new Date()).getTime()}`.substring(0, 10)),
    nonce_str: getNonceStr(),
    session,
    question,
  };
  // 2. 键排序
  const keys = Object.keys(reqData).sort();
  // 3. 将列表N中的参数对按URL键值对的格式拼接成字符串，得到字符串T
  const T = keys.map(k => `${k}=${encodeURI(reqData[k])}`).join('&');
  // 4. 将应用密钥以app_key为键名，组成URL键值拼接到字符串T末尾
  const T01 = `${T}&app_key=${appkey}`;
  // console.log('T01 => ', T01);
  // 5. 对字符串S进行MD5运算，将得到的MD5值所有字符转换成大写
  const md5 = crypto.createHash('md5');
  const sign = md5.update(T01).digest('hex').toUpperCase();
  reqData.sign = sign;
  // return reqData;
  return `${T}&sign=${sign}`;
};

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class NlpchatService extends BaseService {

  /**
   * 合伙人端短信验证
   * @param telephone
   */
  async textchat(sessionKey, content) {
    const ctx = this.ctx;
    // console.log('textchat Params: ', {sessionKey, content});
    try {
      const url = 'https://api.ai.qq.com/fcgi-bin/nlp/nlp_textchat';
      const reqDataParams = getSign(sessionKey, content);
      // const res = await ctx.curl(url, 'POST', reqDataParams, false);
      // console.log('reqDataParams: ', reqDataParams);
      const res = await ctx.curl(url, {
        method: 'GET', contentType: 'json', 
        data: reqDataParams, dataType: 'json',
      });
      // ctx.logger.info('[AI回执]: ', res);
      // 返回验证码所表示的token
      return res.data;
    } catch (err) {
      // ctx.logger.error(e);
      // return new Message(ErrorType.UNKNOW_ERROR, e);
      return ctx.message.official.aiFail(err);
    }
  }
}

module.exports = NlpchatService;
