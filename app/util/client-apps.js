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
  ShiJi_Client: new ClientApp('-', '-'),
  ShiJi_Seller: new ClientApp('-', '-'),
};
