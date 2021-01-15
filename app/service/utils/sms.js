'use strict';
const crypto = require('crypto');
const _ = require('lodash');
// 阿里sdk, 用于短信发送
const Core = require('@alicloud/pop-core');
const randomstring = require('randomstring');

const BaseService = require('../base/base');

// 短信发送部分
const smsClient = new Core({
  accessKeyId: 'LTAIDUW71gwIBLI0',
  accessKeySecret: 'tUUVO4gshvz9UwHHV4brZiASb4lEAd',
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25',
});

// 获取 length 位数的验证码
const getValidCode = length => {
  // 生成 6 位验证码
  return randomstring.generate({
    length, charset: 'numeric',
  }).replace(/0/g, '8');
}

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class SmsService extends BaseService {
  /**
   * @name 发送短信
   * @param {String} phonenum 手机号码
   */
  async send(phonenum) {
    const { ctx } = this;
    // 生成验证码
    const code = getValidCode(6);
    // 定义发送短信模板
    const params = {
      RegionId: 'cn-hangzhou',
      PhoneNumbers: phonenum,
      SignName: '社有吖',
      TemplateCode: 'SMS_147200688',
      TemplateParam: `{code:${code}}`,
    };
    try {
      // 1. 如果用户不存在则新增用户
      const smsRes = await smsClient.request('SendSms', params, { method: 'POST' });
      const smsToken = ctx.generateToken({
        params: { phonenum, code },
        secret: ctx.app.config.jwt.smsSecret,
        expiresIn: 5 * 60,
      });
      return ctx.message.success({ ...smsRes, phonenum, ['smsToken']: smsToken});
    } catch (err) {
      return ctx.message.sms.sendFail( err.data || err , '发送短信时发生异常');
    }
  }

  /**
   * @name 验证短信code有效性
   * @param {String} phonenum 手机号码
   * @param {String} sms_code 验证码
   * @param {String} sms_token 验证token
   */
  async verify(phonenum, sms_code, sms_token) {
    const { ctx } = this;
    try {
      const smsOption = ctx.jwt.verify(sms_token, ctx.app.config.jwt.smsSecret);
      console.log('sms verify smsOption: ' , smsOption);
      if( phonenum !== smsOption?.phonenum || sms_code !== smsOption?.code ) {
        return ctx.message.sms.invalid( { phonenum, sms_code } , '短信验证码错误');
      }
      return ctx.message.success({ phonenum, sms_code, real_code: smsOption.code });
    } catch (err) {
      return ctx.message.exception( err, '短信验证有效性时发生异常');
    }
  }
}

module.exports = SmsService;
