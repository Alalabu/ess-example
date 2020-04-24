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
  ShiJi_Client: new ClientApp('client_app_id', 'client_app_secret'),
  ShiJi_Seller: new ClientApp('seller_app_id', 'seller_app_secret'),
};
