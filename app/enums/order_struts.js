/**
 * 订单状态枚举
 */
module.exports = {
  PREPAY: 'prepay',           // 预支付
  PAY_FAIL: 'pay_fail',       // 支付失败
  ORDER_CLOSE: 'order_close', // 订单关闭
  PAYED: 'payed',             // 已支付成功

  SELLER_TAKE: 'seller_take',   // 商家已接单

  KNIGHT_TAKE: 'knight_take',   // 骑手已接单
  SELLER_DONE: 'seller_done',   // 商家已出单
  SELLER_EXCEP: 'seller_excep', // 商家出单异常
  KNIGHT_ACQU: 'knight_acqu',   // 骑手已取单
  KNIGHT_FAIL: 'knight_fail',   // 骑手送单失败
  ORDER_DONE: 'order_done',     // 订单已完成

  toText(code) { // 将状态编码转为可视化文本
    switch (key) {
      case 'prepay': return '预支付';
      case 'pay_fail': return '支付失败';
      case 'order_close': return '订单关闭';
      case 'payed': return '支付成功';
      case 'seller_take': return '商家已接单';
      case 'knight_take': return '骑手已接单';
      case 'seller_done': return '商家已出单';
      case 'seller_excep': return '商家出单异常';
      case 'knight_acqu': return '骑手已取单';
      case 'knight_fail': return '骑手送单失败';
      case 'order_done': return '订单已完成';
      default: return 'Invalid Code!';
    }
  },
};