'use strict';
/**
 * 响应消息配置
 * 调用方式: ctx.message.auth.noAuth([attach])
 * 返回内容举例: { err: 1001, msg: '您没有权限访问该接口!', attach: undefined }
 */
module.exports = {
  auth: {
    noAuth: [ 1001, '您没有权限访问该接口!' ],
    timeout: [ 1002, 'token 已过期! 请重新获取令牌' ],
    invalid: [ 1003, 'Token 令牌不合法!' ],
  },
};
