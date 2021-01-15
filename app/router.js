'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /**
   * (02) 统一工具
   */
  router.get('获取省份', '/util/province/findAll', controller.utils.area.provinceAll);
  router.get('获取城市', '/util/city/findAll', controller.utils.area.cityAll);
  router.get('获取区县', '/util/district/findAll', controller.utils.area.districtAll);
  router.get('地理位置逆解析', '/util/location/geocoder', controller.utils.area.geocoder);

  router.post('获取文件上传签名', '/util/wechat/file_upload_sign', controller.utils.file.getWechatUploadSign);

  router.post('发送短信', '/util/sms/send', controller.utils.sms.send);
  router.post('短信code有效性验证', '/util/sms/verify', controller.utils.sms.verify);

  // 食材及营养方面
  router.post('新增食材', '/util/food/create', controller.utils.food.create);
  router.post('修改食材', '/util/food/update', controller.utils.food.update);
  router.post('删除食材', '/util/food/delete', controller.utils.food.remove);
  router.get('查询食材(单例)', '/util/food/findOne', controller.utils.food.findOne);
  router.get('查询食材(列表)', '/util/food/findAll', controller.utils.food.findAll);
  router.get('查询食材类别(列表)', '/util/food/typeAll', controller.utils.food.typeAll);

  router.get('营养摄入标准列表', '/util/nutrition/intake', controller.utils.nutrition.intakeAll);
  router.get('营养消耗类别表', '/util/nutrition/consume', controller.utils.nutrition.consumeAll);
  router.get('营养计划推荐方案表', '/util/nutrition/recommended', controller.utils.nutrition.recommendedAll);


  /**
   * (03) 微信公众号相关接口
   */
  router.post('公众号 AT', "/wechat/official/accessToken", controller.wechat.access.officialAccessToken);
  router.post('客户端 AT', "/wechat/sj_client/accessToken", controller.wechat.access.sjClientAccessToken);
  router.post('商户端 AT', "/wechat/sj_seller/accessToken", controller.wechat.access.sjSellerAccessToken);

  // router.get('公众号入口(GET)', "/in", controller.official.getIn);
  // router.get('纯文本响应测试', "/in2", controller.official.postIn2);
  router.post('公众号入口(POST)', "/wechat/in", controller.wechat.official.postIn);
  router.post('unionid换取公众号用户', "/wechat/official/user", controller.wechat.swop.unionidToOfficial);

  /**
   * (04) 普通管理员权限
   */
  // 登录部分
  router.post('管理端登录', '/mgr/login', controller.manager.access.login);
  // Banner 相关接口
  router.post('普/B/新增Banner', '/mgr/banner/create', controller.manager.pa.banner.create);
  router.post('普/B/删除Banner', '/mgr/banner/delete', controller.manager.pa.banner.delete);
  // 商户新增方面
  router.post('普/商/新增商户', '/mgr/store/create', controller.manager.pa.seller.createStore);
  router.post('普/商/修改商户', '/mgr/store/update', controller.manager.pa.seller.updateStore);
  router.post('普/商/删除商户', '/mgr/store/delete', controller.manager.pa.seller.deleteStore);
  router.post('普/商/新增商户管理员', '/mgr/seller/create', controller.manager.pa.seller.createSeller);
  router.post('普/商/修改商户管理员', '/mgr/seller/update', controller.manager.pa.seller.updateSeller);
  router.post('普/商/删除商户管理员', '/mgr/seller/delete', controller.manager.pa.seller.deleteSeller);
  // Seller 相关接口
  router.get('普/圈/查询商圈', '/mgr/area/findAll', controller.manager.pa.area.findAll);
  router.get('普/圈/查询桌签物料', '/mgr/area/tablesign', controller.manager.pa.area.tablesign);

  router.get('普/商/查商户变动列表', '/mgr/seller/auditList', controller.manager.pa.seller.auditList);
  router.get('普/商/查商户变动单例', '/mgr/seller/auditOne', controller.manager.pa.seller.auditOne);
  router.post('普/商/审核信息', '/mgr/seller/audit', controller.manager.pa.seller.audit);

  // Knight 相关接口
  router.post('普/骑/新增骑手', '/mgr/knight/create', controller.manager.pa.knight.create);
  router.post('普/骑/修改骑手', '/mgr/knight/update', controller.manager.pa.knight.update);
  router.post('普/骑/删除骑手', '/mgr/knight/remove', controller.manager.pa.knight.remove);
  // 商户类别管理
  router.post('普/类/新增类别', '/mgr/store_tags/create', controller.manager.pa.storetags.create);
  router.post('普/类/修改类别', '/mgr/store_tags/update', controller.manager.pa.storetags.update);
  router.post('普/类/删除类别', '/mgr/store_tags/delete', controller.manager.pa.storetags.delete);
  router.get('普/类/查询类别单例', '/mgr/store_tags/find', controller.manager.pa.storetags.find);
  // 订单类别管理
  router.post('普/签/新增订单标签', '/mgr/order_tags/create', controller.manager.pa.ordertags.create);
  router.post('普/签/修改订单标签', '/mgr/order_tags/update', controller.manager.pa.ordertags.update);
  router.post('普/签/删除订单标签', '/mgr/order_tags/delete', controller.manager.pa.ordertags.delete);
  router.get('普/签/查询订单标签', '/mgr/order_tags/find', controller.manager.pa.ordertags.find);
  // 数据分析类
  router.get('查询商圈下订单额及数量数据', '/mgr/analyze/order_statistics', controller.manager.analyze.areaOrderStatistics);

  /**
   * 超级管理员权限
   */
  // 商圈 相关接口
  router.post('超/圈/新增商圈', '/mgr/area/create', controller.manager.sa.saarea.create);
  router.post('超/圈/修改商圈', '/mgr/area/update', controller.manager.sa.saarea.update);
  router.post('超/圈/删除商圈', '/mgr/area/delete', controller.manager.sa.saarea.delete);
  // 普管管理 相关接口
  router.post('超/管/新增管理员', '/mgr/gm/create', controller.manager.sa.gm.create);
  router.post('超/管/修改管理员', '/mgr/gm/update', controller.manager.sa.gm.update);
  router.post('超/管/删除管理员', '/mgr/gm/delete', controller.manager.sa.gm.delete);
  router.post('超/管/转移权限', '/mgr/gm/change_auth', controller.manager.sa.gm.changeAuth);
  router.get('超/管/查询gm单例', '/mgr/gm/find', controller.manager.sa.gm.find);
  router.get('超/管/查询gm单例', '/mgr/gm/findAll', controller.manager.sa.gm.findAll);

  /**
   * (05) 订单系统
   */
  router.get('统一订单列表', '/order/unify/findAll', controller.order.orders.findAll);
  router.get('统一订单单例', '/order/unify/find', controller.order.orders.find);
  router.get('订单数量统计', '/order/unify/doneCount', controller.order.orders.doneCount);

  // 用户端订单相关
  router.post('用户端预支付', '/order/client_pay/prepay', controller.order.client.prepay);
  router.post('用户端取消订单', '/order/client_pay/closeorder', controller.order.client.closeorder);
  router.post('用户端重新支付', '/order/client_pay/payagain', controller.order.client.payagain);
  router.post('用户端退费申请', '/order/client_pay/refund', controller.order.client.refund);

  // router.post('用户端支付通知', '/client_pay/pay_notify', controller.client.payNotify);
  router.post('用户端支付通知', '/order/client_pay/pay_notify', controller.order.notify.payNotify);
  router.post('用户端退费通知', '/order/client_pay/refund_notify', controller.order.client.refundNotify);

  router.get('用户端订单列表', '/order/client_pay/findAll', controller.order.client.findAll);
  router.get('用户端订单单例', '/order/client_pay/find', controller.order.client.find);
  router.get('用户端订单单例', '/order/client_pay/todayLimitGoods', controller.order.client.findTodayGoods);

  // 商户端订单相关
  router.post('商户端放弃订单', '/order/seller/giveup', controller.order.seller.giveup);
  router.post('商户端接单', '/order/seller/order_take', controller.order.seller.orderTake);
  router.post('商户端出单', '/order/seller/publish', controller.order.seller.publish);
  router.post('商户端完成订单', '/order/seller/finish', controller.order.seller.finish);
  router.get('商户端订单列表', '/order/seller/findAll', controller.order.seller.findAll);
  router.get('商户端订单单例', '/order/seller/find', controller.order.seller.find);
  // 商户端提款数据相关
  router.get('查询商户提现数据', '/order/withdrawal/stat', controller.order.seller.getWithdrawalStat);
  router.get('查询商户提现记录', '/order/withdrawal/records', controller.order.seller.getWithdrawalRecords);
  router.get('查询商户入账记录', '/order/income/records', controller.order.seller.getIncomeRecords);
  router.post('商户提现操作', '/order/withdrawal', controller.order.seller.withdrawal);
  // 订单评论相关
  router.get('查询评论列表', '/order/orderComment/findAll', controller.order.orderComment.findAll);
  router.get('查询评论单例', '/order/orderComment/findOne', controller.order.orderComment.findOne);
  router.get('查询评论数量', '/order/orderComment/count', controller.order.orderComment.count);
  router.post('新增评论', '/order/orderComment/add', controller.order.orderComment.add);
  router.post('修改评论', '/order/orderComment/update', controller.order.orderComment.update);
  router.post('删除评论', '/order/orderComment/remove', controller.order.orderComment.remove);

  // 返利规则相关
  router.get('查询规则列表', '/order/rebate/rebateAll', controller.order.rebate.findRebateAll);
  router.get('查询规则详情', '/order/rebate/rebateOne', controller.order.rebate.findRebateOne);
  router.get('查询返利获奖名单', '/order/rebate/recordAll', controller.order.rebate.findRecordAll);
  router.post('新增返利规则', '/order/rebate/add', controller.order.rebate.add);
  router.post('修改返利规则', '/order/rebate/update', controller.order.rebate.update);
  router.post('删除返利规则', '/order/rebate/remove', controller.order.rebate.remove);

  /**
   * (06) 客户端
   */
  // 用户信息部分
  router.post('用户登录', '/client/login', controller.accessClient.login);
  router.post('用户信息保存', '/client/saveInfo', controller.user.saveInfo);
  router.get('用户信息查询', '/client/find', controller.user.find);
  // 地址信息部分
  router.post('新增地址', '/client/address/create', controller.address.create);
  router.post('修改地址', '/client/address/update', controller.address.update);
  router.post('删除地址', '/client/address/delete', controller.address.delete);
  router.post('设置默认地址', '/client/address/default', controller.address.setDefault);
  router.get('查询地址单例', '/client/address/find', controller.address.find);
  router.get('查询地址列表', '/client/address/findAll', controller.address.findAll);
  // 关注部分
  router.post('新增关注', '/client/follow/create', controller.follow.create);
  router.post('取消关注', '/client/follow/cancel', controller.follow.cancel);
  router.get('查询关注商户列表', '/client/follow/findAll', controller.follow.findAll);
  // 营养计划部分
  router.post('新增营养计划', '/client/SFMNP/create', controller.sfmnp.create);
  router.post('修改营养计划', '/client/SFMNP/update', controller.sfmnp.update);
  router.post('删除营养计划', '/client/SFMNP/delete', controller.sfmnp.delete);
  router.get('查询营养计划单例', '/client/SFMNP/find', controller.sfmnp.find);
  router.get('查询营养计划列表', '/client/SFMNP/findAll', controller.sfmnp.findAll);
  router.get('查询默认营养计划单例', '/client/SFMNP/default', controller.sfmnp.defaultOne);
  // 每日食物清单部分 
  router.post('修改食物清单中摄入量', '/client/daily/food/update', controller.dailyfood.update);
  router.post('删除食物清单中的食物', '/client/daily/food/delete', controller.dailyfood.delete);
  router.get('查询摄入食物清单(列表)', '/client/daily/food/findAll', controller.dailyfood.findAll);
  router.get('查询每日摄入营养数据', '/client/daily/food/analyze', controller.dailyfood.analyze);
  router.get('查询日期食物摄入统计', '/client/daily/food/date_stat', controller.dailyfood.dateStat);

  /**
   * (07) 商户端
   */
  // 1.1 商户相关
  router.post('商户登录', '/seller/login', controller.accessSeller.login);
  router.get('查询商户单例', '/seller/info/find', controller.store.find);
  // router.get('查询商户列表', '/info/findAll', controller.store.findAll);
  router.post('查询商户列表', '/seller/info/findAll', controller.store.findAll);
  // 1.2 汇总分析
  router.get('查询商户列表', '/seller/order/time_summary', controller.analyze.timeSummary);
  // 1.2 商家相关
  router.post('商户敏感信息申请', '/seller/info/apply', controller.seller.infoApply);
  router.post('商户信息立即修改', '/seller/info/update', controller.seller.infoUpdate);
  // 1.3 子账户操作
  router.post('添加子账号', '/seller/sub/create', controller.seller.createSubAccount);
  router.post('变更子账号状态', '/seller/sub/change_struts', controller.seller.changeSubStruts);
  router.get('查询子账号列表', '/seller/sub/findAll', controller.seller.findSubAccounts);
  // 2. 商品频道
  router.post('新增频道', '/seller/goodsch/create', controller.goodschannel.create);
  router.post('修改频道', '/seller/goodsch/update', controller.goodschannel.update);
  router.post('删除频道', '/seller/goodsch/delete', controller.goodschannel.delete);
  router.get('查询频道单例', '/seller/goodsch/find', controller.goodschannel.find);
  router.get('查询频道列表', '/seller/goodsch/findAll', controller.goodschannel.findAll);
  // 3. 商品
  router.post('新增商品', '/seller/goods/create', controller.goods.create);
  router.post('修改商品', '/seller/goods/update', controller.goods.update);
  router.post('删除商品', '/seller/goods/delete', controller.goods.delete);
  router.get('查询商品单例', '/seller/goods/find', controller.goods.find);
  router.get('查询商品列表', '/seller/goods/findAll', controller.goods.findAll);
  router.get('随机查询餐品', '/seller/goods/randomAll', controller.goods.randomAll);
  // 3.1 商品规格
  router.post('新增商品', '/seller/goods_spec/create', controller.goodsSpec.add);
  router.post('修改商品', '/seller/goods_spec/update', controller.goodsSpec.update);
  router.post('删除商品', '/seller/goods_spec/remove', controller.goodsSpec.remove);
  router.get('查询商品单例', '/seller/goods_spec/find', controller.goodsSpec.findOne);
  router.get('查询商品列表', '/seller/goods_spec/findAll', controller.goodsSpec.findAll);
  // 4. 商品-食材关联关系
  router.post('建立商品食材关联', '/seller/goods/food/create', controller.goodsfood.create);
  router.post('移除商品食材关联', '/seller/goods/food/delete', controller.goodsfood.remove);
  router.get('查询商品食材关联列表', '/seller/goods/food/findAll', controller.goodsfood.findAll);
  // 4. 商户类别管理
  router.get('查询商户类别', '/seller/tags/findAll', controller.tags.tagsFindAll);
  router.get('查询订单标签', '/seller/order_tags/findAll', controller.tags.orderTagsFindAll);
  // 3. 商品类别管理
  router.post('新增商品类别', '/seller/goodsType/add', controller.goodsType.add);
  router.post('修改商品类别', '/seller/goodsType/update', controller.goodsType.update);
  router.post('删除商品类别', '/seller/goodsType/remove', controller.goodsType.remove);
  router.get('查询商品类别单例', '/seller/goodsType/findOne', controller.goodsType.findOne);
  router.get('查询商品类别列表', '/seller/goodsType/findAll', controller.goodsType.findAll);
  router.get('查询商品类别子集', '/seller/goodsType/children', controller.goodsType.children);
  // 5. banners管理
  router.get('查询banners', '/seller/area/banners', controller.banner.findAll);
  // 6. 商圈部分
  router.get('查询商圈单例', '/seller/area/find', controller.storearea.find);
  router.get('查询商圈列表', '/seller/area/findAll', controller.storearea.findAll);
  router.get('查询已开通商圈的省份', '/seller/area/findProvince', controller.storearea.findProvince);
  // 7. 商圈餐厅管理
  router.post('新增餐厅', '/seller/dining/add', controller.storeDining.add);
  router.post('修改餐厅', '/seller/dining/update', controller.storeDining.update);
  router.post('删除餐厅', '/seller/dining/remove', controller.storeDining.remove);
  router.get('查询餐厅单例', '/seller/dining/findOne', controller.storeDining.findOne);
  router.get('查询餐厅列表', '/seller/dining/findAll', controller.storeDining.findAll);

  /**
   * 【折扣券管理】  
   */  
  // 1. 折扣券基本信息管理
  router.post('新增折扣券', '/seller/ticket_info/add', controller.ticketInfo.add);
  router.post('修改折扣券', '/seller/ticket_info/update', controller.ticketInfo.update);
  router.post('删除折扣券', '/seller/ticket_info/remove', controller.ticketInfo.remove);
  router.get('查询折扣券单例', '/seller/ticket_info/findOne', controller.ticketInfo.findOne);
  router.get('查询折扣券列表', '/seller/ticket_info/findAll', controller.ticketInfo.findAll);
};
