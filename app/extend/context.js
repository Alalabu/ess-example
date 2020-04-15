'use strict';

const Cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {

  get jwt() {
    return jwt;
  },

  returnSucc(msg = '成功', code = 0, httpCode = 200) {
    throw new global.myErrors(msg, code, httpCode);
  },

  returnError(msg = '失败', code = 1, httpCode = 400) {
    throw new global.myErrors(msg, code, httpCode);
  },

  crypto(value) {
    return Cryptojs.HmacSHA256(value, 'drw_admin888').toString();
  },
};
