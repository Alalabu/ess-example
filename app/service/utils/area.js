'use strict';
const crypto = require('crypto');
const _ = require('lodash');
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class AreaService extends BaseService {
  /**
   * 返回所有的省份信息
   */
  async provinceAll() {
    const { ctx } = this;
    // 判断缓存
    const cacheKey = 'provinceAll';
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      console.log('[Redis cacheData] use redis by cacheKey=provinceAll.');
      return ctx.message.success(cacheData);
    }

    const { Province } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const provinces = await Province.findAll({ raw: true });
      // 数据缓存
      const seconds = 60 * 60 * 24 * 7;
      await this.setCache(cacheKey, provinces, seconds);
      return ctx.message.success(provinces);
    } catch (err) {
      return ctx.message.exception( err , '查询省份信息发生异常');
    }
  }

  async cityAll(provincecode) {
    const { ctx } = this;
    // 判断缓存
    const cacheKey = `city/findAll?provincecode=${provincecode}`;
    const cacheData = await this.getCache(cacheKey);
    if (cacheData) {
      console.log('[Redis cacheData] use redis by cacheKey=cityAll.');
      return ctx.message.success(cacheData);
    }

    const { City } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const cties = await City.findAll({ where: { provincecode }, raw: true });
      // 数据缓存
      if (_.isArray(cties) && cties?.length > 0) {
        const seconds = 60 * 60 * 24 * 7;
        await this.setCache(cacheKey, cties, seconds);
      }
      return ctx.message.success(cties);
    } catch (err) {
      return ctx.message.exception( err , '查询城市信息发生异常');
    }
  }

  async districtAll(citycode) {
    const { ctx } = this;
    const { District } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const districts = await District.findAll({ where: { citycode }, raw: true });
      return ctx.message.success(districts);
    } catch (err) {
      return ctx.message.exception( err , '查询区县信息发生异常');
    }
  }

  // 用于查询所有模型数据的方法
  async geocoder(lat, lng) {
    const { ctx } = this;
    try {
      // map sign
      // const mapKey = 'AY5BZ-RJFC2-GWGU7-CK622-G27N7-ZDFRW';
      // const SK = 'eMfRk5pkcA61QUXezJPdyJikFIhUOYGh';
      // const md5 = crypto.createHash('md5');
      // const sig = md5.update(`/ws/geocoder/v1/?key=${mapKey}&location=${lat},${lng}${SK}`).digest('hex'); // 签名计算结果
      // const wxurl = `https://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${mapKey}&sig=${sig}`;
      const AK = '3bEmnahrpBEvbiDi0e1GOuqf';
      const wxurl = `http://api.map.baidu.com/reverse_geocoding/v3/?ak=${AK}&output=json&coordtype=wgs84ll&location=${lat},${lng}`;
      // console.log('逆解析地理位置 v3 wxurl: ', wxurl);
      const result = await ctx.curl(wxurl, {
        dataType: 'json',
      });
      const res = result.data;
      // console.log('逆解析地理位置 v3 res.data: ', res);
      if (res.status === 0 && res.result) {
        return ctx.message.success(res.result);
        // const { nation_code, city_code } = res.result.ad_info;
        // const city_simple_code = city_code.substring(nation_code.length);
        // return ctx.message.success({
        //   lat,
        //   lng,
        //   address: res.result.address,
        //   recommend: res.result.formatted_addresses?.recommend,
        //   rough: res.result.formatted_addresses?.rough,
        //   address_component: res.result.address_component,
        //   city_code: city_simple_code,
        //   ad_name: res.result.ad_info.name,
        // });
      }
      return ctx.message.location.inverseAnalyticalFail({ res, wxurl }, '【定位相关】地理定位错误');
    } catch (error) {
      // console.error(error);
      return ctx.message.exception(error, '【定位相关】地理定位发生异常');
    }
  }
}

module.exports = AreaService;
