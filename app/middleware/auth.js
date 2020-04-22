'use strict';

/**
 * token 访问授权
 * @param { Array } options 配置项：不需要鉴权的路由
 * @param { Object } app 当前应用
 */
module.exports = (options, app) => {

  return async (ctx, next) => {

    // 1.排除不需要验证 token 的路由
    if (options.allowed.indexOf(ctx.request.url) > -1) return await next(options);

    // 2. 获取 header 头token
    const { authorization = '' } = ctx.header;
    if (!authorization) ctx.returnError(ctx.message.auth.noAuth());

    // 3. 根据token解密，换取用户信息
    let user = {};
    try {
      user = ctx.jwt.verify(authorization, app.config.jwt.secret);
    } catch (err) {
      err.name === 'TokenExpiredError' ? ctx.returnError(ctx.message.auth.timeout()) :
        ctx.returnError(ctx.message.auth.invalid());
    }

    // 4. 把 user 信息挂载到全局 ctx 上
    ctx.auth = user;

    // 5. 继续执行
    await next(options);
  };
};
