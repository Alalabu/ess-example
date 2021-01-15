'use strict';
/**
 * 响应消息配置
 * 调用方式: ctx.message.auth.noAuth([attach])
 * 返回内容举例: { err: 1001, msg: '您没有权限访问该接口!', attach: undefined }
 */
module.exports = {
  success: [ 0, 'SUCCESS' ],
  login: {
    newuser: [ 20, 'SUCCESS' ],
  },
  param: {
    invalid: [ 100, '参数无效!', 'errlog' ],
    miss: [ 101, '参数缺失!', 'errlog' ],
  },
  result: {
    repetition: [ 120, '结果集重复!', 'infolog' ],
    noData: [ 121, '未找到结果集!', 'errlog' ],
    noAffect: [ 122, '未修改任何数据!', 'errlog' ],
    invalid: [ 123, '查询条件不合规!', 'errlog' ],
  },
  db: {
    noAffectRows: [ 200, '操作未影响任何数据', 'errlog' ],
    noQueryRows: [ 201, '未查询到任何数据', 'errlog' ],
  },
  auth: {
    noAuth: [ 1001, '您没有权限访问该接口!', 'errlog' ],
    timeout: [ 1002, 'token 已过期! 请重新获取令牌', 'warnlog' ],
    invalid: [ 1003, 'Token 令牌不合法!', 'infolog' ],
    noApiUser: [ 1004, '未找到操作用户!', 'errlog' ],
    noManagerPermission: [ 1005, '缺少管理权限!', 'errlog' ],
    noManagerParams: [ 1006, '缺少管理参数!', 'errlog' ],
  },
  access: {
    noPhone: [ 1100, '用户手机号码未绑定!', 'infolog' ],
    noOpenid: [ 1101, '登录无法获取openid!', 'errlog' ],
    noUnionidOrSessionKey: [ 1102, '登录无法获取unionid或session_key!', 'errlog' ],
    invalidPhone: [ 1104, '手机号码无权限!', 'infolog' ],
    strutsDisabled: [ 1105, '用户权限为 未启用 状态!', 'infolog' ],
  },
  foodplan: {
    disableCancel: [ 1200, '不能取消唯一的默认计划!', 'infolog' ],
    disableDelete: [ 1201, '不能删除默认的默认计划!', 'infolog' ],
  },
  dailyfood: {
    usePercentInvalid: [ 1202, '食物清单中的食物摄入比例值无效, 必须为 0-100 之间的数字!', 'infolog' ],
  },
  channel: {
    hasGoodsNotDelete: [ 2010, '频道下有商品无法删除!', 'infolog' ],
    mustHasOne: [ 2011, '商铺下至少需要保留一个频道!', 'infolog' ],
  },
  goods: {
    mustStopBiz: [ 2100, '必须在关店时进行该操作!', 'infolog' ],
  },
  seller: {
    applyParamsEmpty: [ 2200, '申请变更的数据为空!', 'infolog' ],
    noPermiss: [ 2201, '没有操作权限!', 'errlog' ],
  },

  // 订单系统
  prepay: {
    returnFail: [ 2000, '[RETURN] 统一预支付请求错误', 'errlog' ],
    resultFail: [ 2001, '[RESULT] 统一预支付结果异常', 'errlog' ],
    goodsLack: [ 2002, '商品数量不足', 'errlog' ],
  },
  refund: {
    returnFail: [ 2010, '[RETURN] 统一退费请求错误', 'errlog' ],
    resultFail: [ 2011, '[RESULT] 统一退费结果异常', 'errlog' ],
    noMch: [ 2012, '[Notify] 未找到支付商户支持', 'errlog' ],
  },
  closeOrder: {
    returnFail: [ 2020, '[RETURN] 统一关闭订单请求错误', 'errlog' ],
    resultFail: [ 2021, '[RESULT] 统一关闭订单结果异常', 'errlog' ],
  },
  queryOrder: {
    returnFail: [ 2020, '[RETURN] 统一查询订单请求错误', 'errlog' ],
    resultFail: [ 2021, '[RESULT] 统一查询订单结果异常', 'errlog' ],
  },
  notify: {
    fail: [ 2100, '统一支付相关通知错误', 'errlog' ],
    pending: [ 2101, '支付通知处理中,忽略重复处理过程...', 'errlog' ],
  },
  clientOrder: {
    noGoodsList: [ 3001, '[clientOrder] 未找到订单商品', 'errlog' ],
    noAddress: [ 3002, '[clientOrder] 该配送地址不存在', 'errlog' ],
  },
  storeOrder: {
    orderInvalid: [ 3101, '[storeOrder] 未找到相应订单', 'errlog' ],
    osConditionInvalid: [ 3102, '[storeOrder] 订单前置状态条件不满足', 'errlog' ],
  },
  transfers: {
    returnFail: [ 3201, '[RETURN] 企业付款至商户零钱请求错误', 'errlog' ],
    resultFail: [ 3202, '[RESULT] 企业付款至商户零钱结果异常', 'errlog' ],
    sellerNotFound: [ 3203, '[Seller Not Found] 企业付款至商户零钱, 商家管理员未找到!', 'errlog' ],
    sellerNoOpenid: [ 3204, '[Seller No Openid] 企业付款至商户零钱, 商家管理员无 openid!', 'errlog' ],
    unknow: [ 3205, '[Unknow] 企业付款至商户零钱, 出现未知异常!', 'errlog' ],
    recordFail: [ 3206, '[Record Fail] 企业付款至商户零钱, 写入提款记录失败!', 'errlog' ],
    amountExceedingLimit: [ 3207, '[Amount exceeding limit] 企业付款至商户零钱, 当前提款金额超出微信限制!', 'errlog' ],
    withdrawalExceedingBalance: [ 3208, '[Withdrawal Exceeding Balance] 企业付款至商户零钱, 实际提款额超过所剩余额!', 'errlog' ],
    withdrawaledExceedingIncome:[ 3209, '[Withdrawaled Exceeding Income] 企业付款至商户零钱,已提款额超过实际入账总额(历史入账)!', 'errlog' ],
    databaseIOFail: [ 3210, '[Database IO Fail] 企业付款至商户零钱, 变更数据库数据失败!', 'errlog' ],
    sellersOutOfLimit: [ 3211, '[Sellers Out Of Limit] 企业付款至商户零钱, 商家管理员数量超出限制, 不得大于1位', 'errlog' ],
    historyIncomeFail: [ 3212, '[History Income Fail] 企业付款至商户零钱, 总体收益入账出现不一致!', 'errlog' ],
    withdrawalFail: [ 3213, '[Withdrawal Fail] 企业付款至商户零钱, 已提款额度出现不一致!', 'errlog' ],
    balanceFail: [ 3214, '[Balance Fail] 企业付款至商户零钱, 可提款额度(余额)出现不一致!', 'errlog' ],
  },
  withdrawal: {
    sellerNotFound: [ 3301, '[Seller Not Found] 入账记录过程, 商家管理员未找到!', 'errlog' ],
    sellerNoOpenid: [ 3302, '[Seller No Openid] 入账记录过程, 商家管理员无 openid!', 'errlog' ],
    sellersOutOfLimit: [ 3303, '[Sellers Out Of Limit] 入账记录过程, 商家管理员数量超出限制, 不得大于1位', 'errlog' ],
    unknow: [ 3304, '[Unknow] 入账记录过程, 出现未知异常!', 'errlog' ],
    recordFail: [ 3305, '[Record Fail] 入账记录过程, 回款记录失败!', 'errlog' ],
    ratioNotInteger: [ 3306, '[Ratio Not a Integer] 入账记录过程, 商户分款比例不是一个有效的Integer!', 'errlog' ],
    incomeRecordFail: [ 3307, '[Income Record Fail] 入账记录过程, 入账记录写入失败!', 'errlog' ],
  },
  income_stat: {
    sellerNotFound: [ 3401, '[Seller Not Found] 收益统计过程, 商家管理员未找到!', 'errlog' ],
    sellersOutOfLimit: [ 3402, '[Sellers Out Of Limit] 收益统计过程, 商家管理员数量超出限制, 不得大于1位', 'errlog' ],
    historyIncomeFail: [ 3403, '[History Income Fail] 收益统计过程, 总体收益入账出现不一致!', 'errlog' ],
    withdrawalFail: [ 3404, '[Withdrawal Fail] 收益统计过程, 已提款额度出现不一致!', 'errlog' ],
    balanceFail: [ 3405, '[Balance Fail] 收益统计过程, 可提款额度(余额)出现不一致!', 'errlog' ],
    statFail: [ 3406, '[Stat Fail] 收益统计过程, 出现数据计算不一致!', 'infolog' ],
  },
  dailyfood: {
    writeFail: [ 3500, '[Write Fail] 写入用户食物清单失败!', 'errlog' ],
    noGoods: [ 3501, '[No Goods] 写入用户食物清单时未找到相关商品!', 'errlog' ],
    noGoodsList: [ 3502, '[No Goods List] 写入用户食物清单时未找到商品清单!', 'errlog' ],
  },

  // 管理端
  audit: {
    noAuditData: [ 1200, '未找到可以变更的审核数据!', 'errlog' ],
  },
  gm: {
    repetition: [ 1300, '手机号码重复!', 'infolog' ],
  },

  // 公众号
  official: {
    aiFail: [ 1105, 'AI自动回复错误', 'errlog' ],
    writeUserFail: [ 1110, '写入公众号用户发生错误', 'errlog' ],
    noUserUnionid: [ 1111, '当前用户的unionid不存在', 'errlog' ],
  },
  role: {
    low: [ 1135, '接口操作权限不足', 'errlog' ],
    accessTokenInvalid: [ 1136, 'Access Token 无效', 'errlog' ],
  },

  // 工具
  sms: {
    sendFail: [ 1020, '发送短信失败', 'errlog' ],
    invalid: [ 1021, '短信验证失败', 'infolog' ],
  },
  location: {
    inverseAnalyticalFail: [ 1010, '逆解析坐标时失败!', 'errlog' ],
  },

  exception: [ -1, 'Unknow Exception', 'errlog' ],
};
