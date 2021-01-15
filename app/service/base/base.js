'use strict';
const _ = require('lodash');
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

  async delCache(key) {
    if (this.app.redis) {
      return await this.app.redis.del(key);
    }
  }

  /**
   * -------------------- 以下是针对 Hash 的缓存操作 ------------------
   */

  /**
   * 设置 Hash 值
   * @param {*} key 
   * @param {*} field 
   * @param {*} value 
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashSetData(key, field, value, isJson = true) {
    if (this.app.redis) {
      if (isJson) value = JSON.stringify(value);
      return await this.app.redis.hset(key, field, value);
    }
  }

  /**
   * 获取Hash指定 key 中字段 field 的值
   * @param {*} key 
   * @param {*} field 
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashGetData(key, field, isJson = true) {
    if (this.app.redis) {
      const value = await this.app.redis.hget(key, field)
      if (isJson) return JSON.parse(value);
      return value;
    }
  }

  /**
   * 删除 Hash 指定 Field 的值
   * @param {*} key 
   * @param  {...any} fields 
   */
  async hashDelete(key, ...fields) {
    if (this.app.redis) {
      return await this.app.redis.hdel.apply(this.app.redis, [key, ...fields]);
    }
  }

  /**
   * 删除 Hash 所有值
   * @param {*} key 
   */
  async hashDeleteAll(key) {
    if (this.app.redis) {
      const fields = await this.app.redis.hkeys(key);
      if (!_.isArray(fields) || fields.length === 0) return 0;
      return this.hashDelete.apply(this, [key, ...fields]);
    }
  }

  /**
   * 当前 Hash 表的长度
   * @param {*} key 
   */
  async hashLength(key) {
    if (this.app.redis) {
      return await this.app.redis.hlen(key);
    }
  }

  /**
   * 查看当前的 Hash 是否存在
   * @param {*} key 
   * @param {*} field 
   */
  async hashExists(key, field) {
    if (this.app.redis) {
      return await this.app.redis.hexists(key, field);
    }
  }

  /**
   * 批量设置Hash值
   * @param {*} key 键
   * @param {Object} data 键值对对象
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashMSet({key, data, isJson = true}) {
    if (this.app.redis) {
      if (isJson) Object.keys(data).forEach(k => data[k] = JSON.stringify(data[k]));
      // if (isJson) {
      //   console.log('data: ', data);
      //   const keys = Object.keys(data)
      //   console.log('keys: ', keys);
      //   keys.forEach(k => data[k] = JSON.stringify(data[k]));
      // }
      return await this.app.redis.hmset(key, data);
    }
  }

  /**
   * 根据字段寻找 Hash 值
   * @param {*} key 
   * @param {...any} fields 
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashMGet({key, fields, isJson = true}) {
    if (this.app.redis) {
      const value = await this.app.redis.hmget.apply(this.app.redis, [key, ...fields]);
      if (isJson) return value.map( el => JSON.parse(el));
      return value;
    }
  }

  /**
   * 获取 Hash 表中所有的 键和值
   * @param {*} key 
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashGetEntries(key, isJson = true) {
    if (this.app.redis) {
      const value = await this.app.redis.hgetall(key);
      if (isJson) Object.keys(value).forEach(k => value[k] = JSON.parse(value[k]));
      return value;
    }
  }

  /**
   * 获取哈希表中所有键列表
   * @param {*} key 
   */
  async hashGetFields(key) {
    if (this.app.redis) {
      return await this.app.redis.hkeys(key)
    }
  }

  /**
   * 获取哈希表中所有值列表
   * @param {*} key 
   * @param {Boolean} isJson value是否是一个 JSON 格式数据, 默认: true
   */
  async hashGetValues(key, isJson = true) {
    if (this.app.redis) {
      const value = await this.app.redis.hvals(key);
      if (isJson) return Object.keys(value).map(k => JSON.parse(value[k]));
      return value;
    }
  }

  
}

module.exports = BaseService;
