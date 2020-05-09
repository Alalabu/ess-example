/* eslint-disable no-return-assign */
'use strict';

const Cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');
const { Calendar } = require('calendar2');
const Sequelize = require('sequelize');

const ResponseMessageConfig = require('../../config/message.config.js');
const ResponseMessage = Symbol('Response#Message');

module.exports = {
  get uuid32() {
    return uuidv1().replace(/-/g, '');
  },
  get uuid36() {
    return uuidv1();
  },
  get NOW() {
    return new Calendar();
  },
  get Op() {
    return Sequelize.Op;
  },
  // 加载响应消息配置, 统一封装响应消息在 Context 中的调用
  get message() {
    if (!this[ResponseMessage]) {
      // 加载 响应消息对象
      const ctx = this;
      const resMsg = (function loadConfig(config) {
        if (_.isArray(config)) {
          return function(data, detail) {
            const m = { err: config[0], msg: config[1], data, detail };
            // eslint-disable-next-line default-case
            switch (config[2]) { // 对于错误的处理方式
              case 'errlog':
                ctx.logger.error('[%s | %s] %s :', m.err, m.msg, (detail || ''), m.data);
                break;
              case 'warnlog':
                ctx.logger.warn('[%s | %s] %s :', m.err, m.msg, (detail || ''), m.data);
                break;
              case 'infolog':
                ctx.logger.info('[%s | %s] %s :', m.err, m.msg, (detail || ''), m.data);
                break;
            }
            return m;
          };
        }
        const msg = {};
        Object.keys(config).forEach(key => msg[key] = loadConfig(config[key]));
        return msg;
      })(ResponseMessageConfig);
      this[ResponseMessage] = resMsg;
    }
    return this[ResponseMessage];
  },

  get jwt() {
    return jwt;
  },
  /**
   * 解析签名, 返回解析结果. true则为解析成功, false为解析失败
   * @param {Object} data 参数列表
   * @param {String} secret 密钥
   * @param {String} sign 需要对比的签名
   */
  equalsSign(data, secret, sign) {
    // 1. 签名的 md5 解密(数据对比)
    const md5 = crypto.createHash('md5');
    const paramKeys = Object.keys(data);
    paramKeys.sort();
    const string1 = paramKeys.map((k) => data[k]).join('&');
    const _sign = md5.update(`${string1}${secret}`).digest('hex');
    // 4. 比对签名结果
    return _sign === sign;
  },
  /**
   * 将参数和密钥进行 MD5 签名, 返回 sign 签名字符串
   * @param {Object} data 参数列表
   * @param {String} secret 密钥
   */
  parseSign(data, secret){
    const md5 = crypto.createHash('md5');
    const paramKeys = Object.keys(data);
    paramKeys.sort();
    const string1 = paramKeys.map((k) => data[k]).join('&');
    return md5.update(`${string1}${secret}`).digest('hex');
  },
  // 获取随机 (长度为 len) 的字符串
  getNonceStr(len){
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  // 获取当前的时间戳
  get timeStamp() {
    return Number(`${(new Date()).getTime()}`.substring(0, 10));
  },

  returnSuccess({ msg = '成功', err = 0, data = null }) {
    return { msg, err, data };
  },

  returnWarn({ msg = '失败', err = 99, attach = null }) {
    this.logger.warn({ err, msg, attach });
    return { msg, err, attach };
  },

  returnError({ msg = '失败' }) {
    throw new Error(msg);
  },

  crypto(value, key = 'drw_admin888') {
    return Cryptojs.HmacSHA256(value, key).toString();
  },

  /**
   * 生成 Token
   * @param { Object } params token 封装参数
   * @param { String } secret token 解码密钥
   * @param { Number } expiresIn 生命周期, 单位: 秒
   */
  generateToken({ params = {}, secret, expiresIn = 24 * 60 * 60 }) {
    return jwt.sign(params, secret || this.app.config.jwt.secret, {
      expiresIn: expiresIn || this.app.config.jwt.expiresIn,
    });
  },


};
