'use strict';
/**
 * 文件存储前端应用密钥
 */

class ClientApp {
  constructor(appid, appsecret) {
    this.appid = appid;
    this.appsecret = appsecret;
  }
}

module.exports = {
  ShiJi_Client: new ClientApp('wxe8235731204bc54c', '91828c31e5b35ffd9bfb6393204af2d7'),
  ShiJi_Seller: new ClientApp('wxca2ddba40596d5de', '1b72048d5f829da396ddf9360891b138'),
};
