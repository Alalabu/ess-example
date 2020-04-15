'use strict';
const { Service } = require('egg');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class BaseService extends Service {

  // constructor(){}

  async setCache(key, value, seconds) {
    value = JSON.stringify(value);
    if (this.app.redis) {
      if (!seconds) {
        await this.app.redis.set(key, value);
      } else {
        await this.app.redis.set(key, value, 'EX', seconds);
      }
    }
  }

  async getCache(key) {
    if (this.app.redis) {
      const data = await this.app.redis.get(key);
      if (!data) return;
      return JSON.parse(data);
    }
  }
}

module.exports = BaseService;
