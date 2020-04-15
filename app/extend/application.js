'use strict';

const jwt = require('jsonwebtoken');
module.exports = {
  /**
   * 生成 Token
   * @param { Object } params 带封装的参数对象
   */
  generateToken(params = {}) {
    return jwt.sign(params, this.config.jwt.secret, {
      expiresIn: this.config.jwt.expiresIn,
    });
  },
};
