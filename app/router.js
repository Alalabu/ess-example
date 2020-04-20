'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('主页', '/', controller.home.index);
  router.get('查询全部', '/query', controller.home.query);
  router.post('检查Token', '/checkToken', controller.home.checkToken);
  router.post('登录', '/login', controller.user.login);
  router.post('注册', '/register', controller.user.register);
  router.post('女生最爱TOP10', '/findGirlsFondness', controller.home.findGirlsFondness);

  router.resources('REST address', '/address', controller.address);
  // router.resources('{"name": "地址管理", "type": "rest"}', '/address', controller.address);
};
