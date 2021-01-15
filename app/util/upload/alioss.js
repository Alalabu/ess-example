'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const AliOSS = require('ali-oss');
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');
const env = {
  region: 'oss-cn-huhehaote',
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAIbwVY1kExQevZ',
  accessKeySecret: 'eIgtgWQWbP9yPbJ8M5lDNDW3s0DA7c',
  bucket: 'sheu-huabei5',
  timeout: 87600,
  // OSS地址，需要https
  uploadImageUrl: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com',
};
/**
 * Policy 编码加密
 */
const getPolicyBase64 = function() {
  const date = new Date();
  date.setHours(date.getHours() + env.timeout);
  const srcT = date.toISOString();
  const policyText = {
    expiration: srcT,
    conditions: [
      [ 'content-length-range', 0, 5 * 1024 * 1024 ],
    ],
  };
  const policyBase64 = new Buffer(JSON.stringify(policyText)).toString('base64');
  return policyBase64;
};
/**
 * 获取上传图片用的签名
 */
exports.aliossSignature = async (filepath, dir) => {
  try {
    // console.log(`上传图片签名日志 ==>  {filepath: ${filepath}} `);
    // 过滤路径
    const aliyunFileKey = dir + filepath.replace('http://tmp/', ''); // 文件名
    // console.log(`上传图片签名日志 ==>  {aliyunFileKey: ${aliyunFileKey}} `);
    const policyBase64 = getPolicyBase64();
    const accesskey = env.accessKeySecret;
    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
      asBytes: true,
    });
    const signature = Crypto.util.bytesToBase64(bytes);
    return {
      url: env.uploadImageUrl,
      key: aliyunFileKey,
      policy: policyBase64,
      OSSAccessKeyId: env.accessKeyId,
      signature,
    };
  } catch (error) {
    return error;
  }
};
const separ = {
  SHEU: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/',
};
/**
 * 截取OSS中对象的方法
 * @param {*} url
 * @param {*} separator
 */
const truncateObject = (url, separator = separ.SHEU) => url.replace(separator, '');
// 获取AliOSS操作对象
const client = new AliOSS(env);
/**
 * 删除单独的 OSS 中的照片
 * obj
 */
exports.deleteOnec = async obj => {
  try {
    console.log('================> ', truncateObject(obj));
    return await client.delete(truncateObject(obj));
  } catch (e) {
    console.log(e);
    return e;
  }
};
/**
 * 批量删除 OSS 中的照片
 * [
 *  dir+filename,dir+filename
 * ]
 */
exports.deleteMulti = async objs => {
  try {
    console.log('【deleteMulti  OSS照片删除（过滤前）】', objs);
    objs = objs.map(o => truncateObject(o));
    console.log('【deleteMulti  OSS照片删除（过滤后）】', objs);
    return await client.deleteMulti(objs);
  } catch (e) {
    console.log(e);
    return e;
  }
};

/**
 *  获取 上传小程序码至阿里云OSS 时所需的 sign 配置
 * @param ossKey {string}
 */
// exports.getAliossSign = ossKey => {
//   try {
//     const aliyunFileKey = `sheu_shiji/${ossKey}`;
//     const policyBase64 = getPolicyBase64();
//     const accesskey = env.accessKeySecret;
//     const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
//       asBytes: true,
//     });
//     const signature = Crypto.util.bytesToBase64(bytes);
//     return {
//       url: env.uploadImageUrl,
//       key: aliyunFileKey,
//       policy: policyBase64,
//       OSSAccessKeyId: env.accessKeyId,
//       signature,
//     };
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };
