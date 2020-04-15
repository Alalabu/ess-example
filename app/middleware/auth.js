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
    if (!authorization) ctx.returnError('您没有权限访问该接口!', 0, 401);
    const token = authorization.replace('Bearer ', '');

    // 3. 根据token解密，换取用户信息
    let user = {};
    try {
      user = ctx.jwt.verify(token, app.config.jwt.secret);
    } catch (err) {
      err.name === 'TokenExpiredError' ? ctx.returnError('token 已过期! 请重新获取令牌') :
        ctx.returnError('Token 令牌不合法!');
    }

    // 4. 把 user 信息挂载到全局 ctx 上
    ctx.auth = {
      uid: user.uid,
      scope: user.scope,
    };

    // 5. 继续执行
    await next(options);
  };
};
