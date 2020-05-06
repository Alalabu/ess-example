'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('获取省份', '/province/findAll', controller.area.provinceAll);
  router.get('获取城市', '/city/findAll', controller.area.cityAll);
  router.get('获取区县', '/district/findAll', controller.area.districtAll);
  // router.get('测试抛出异常', '/getError', controller.user.getError);
  // router.get('查询全部', '/query', controller.home.query);
  // router.post('检查Token', '/checkToken', controller.home.checkToken);
  // router.post('登录(post异常)', '/login', controller.user.login);
  // router.post('注册', '/register', controller.user.register);
  // router.post('女生最爱TOP10', '/findGirlsFondness', controller.home.findGirlsFondness);

  // router.post('订单生成', '/newOrder', controller.user.newOrder);

  router.post('/clientLogin', controller.access.clientLogin);

};
