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
  Official: new ClientApp('wx18aa432769631379', '200919d8241d3aa29402b2535a6e4e64'),
  Client: new ClientApp('wxe8235731204bc54c', '91828c31e5b35ffd9bfb6393204af2d7'), // 社有社区
  // Client: new ClientApp('wxcf0228511283435a', '964d0efcfd8266faedf4eba3cc8d258a'), // 社有食纪
  Seller: new ClientApp('wxca2ddba40596d5de', '1b72048d5f829da396ddf9360891b138'),
  Manager: new ClientApp('wxaa6bce288a81f5ce', '94bffbe5752c9b0b30f7a39cf5bd55cb'),
};
