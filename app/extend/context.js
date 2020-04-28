/* eslint-disable no-return-assign */
'use strict';

const Cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const uuidv1 = require('uuid/v1');

const ResponseMessageConfig = require('../../config/message.config.js');
const ResponseMessage = Symbol('Response#Message');

module.exports = {
  get uuid32() {
    return uuidv1().replace(/-/g, '');
  },
  get uuid36() {
    return uuidv1();
  },
  // 加载响应消息配置, 统一封装响应消息在 Context 中的调用
  get message() {
    if (!this[ResponseMessage]) {
      // 加载 响应消息对象
      const ctx = this;
      const resMsg = (function loadConfig(config) {
        if (_.isArray(config)) {
          return function(attach) {
            const m = { err: config[0], msg: config[1], attach };
            ctx.logger.error('[%s | %s] %s', m.err, m.msg, m.attach);
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

  crypto(value) {
    return Cryptojs.HmacSHA256(value, 'drw_admin888').toString();
  },

  /**
   * 生成 Token
   * @param { Object } params token封装参数
   */
  generateToken({ params = {}, secret, expiresIn = 24 * 60 * 60 }) {
    return jwt.sign(params, secret || this.app.config.jwt.secret, {
      expiresIn: expiresIn || this.app.config.jwt.expiresIn,
    });
  },


};
