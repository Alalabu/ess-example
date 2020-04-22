'use strict';

const jwt = require('jsonwebtoken');
module.exports = {
  /**
   * 生成 Token
   * @param { Object } params 带封装的参数对象
   */
  generateToken({ params = {}, secret, expiresIn = 24 * 60 * 60 }) {
    return jwt.sign(params, secret || this.app.config.jwt.secret, {
      expiresIn: expiresIn || this.app.config.jwt.expiresIn,
    });
  },
};
