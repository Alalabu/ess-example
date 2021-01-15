/**
 * 负责管理微信推送消息
 */

const send = async (access_token, post_data) => {
  // 发送消息模板
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
  return await ctx.curl(url, {
    dataType: 'json',
    method: 'POST',
    data: post_data,
  });
};

/**
 * 为客户发送【公众号】支付消息推送
 */
const paySuccessToUser = async ({ access_token, touserOpenid, storeName, out_trade_no, goodsName, payFee, payAt }) => {
  const post_data = {
    touser: touserOpenid,
    template_id: 'MxmuDRPbuBGVZmD9mbGNeLwZBoyAEuIo5xNes2Ah1wA',
    miniprogram: {
      appid: 'wxcf0228511283435a',
      pagepath: 'pages/guide/guide',
    },
    data: {
      first: { value: '支付成功！', color: '#173177' },
      keyword1: { value: storeName, color: '#173177' },
      keyword2: { value: out_trade_no, color: '#173177' },
      keyword3: { value: goodsName, color: '#353535' },
      keyword4: { value: `￥${payFee / 100}`, color: '#173177' },
      keyword5: { value: payAt, color: '#173177' },
      remark: { value: '恭喜您亲耐滴，祝您生活愉快哟~', color: '#173177' },
    },
  };
  return send(access_token, post_data);
};

module.exports = {
  paySuccessToUser,
};