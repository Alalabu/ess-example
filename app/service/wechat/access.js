'use strict';

const { Service } = require('egg');

class AccessService extends Service {
  /**
   * 刷新小程序 ACCESS_TOKEN
   */
  async refreshMiniprogramAccessToken(appid, appsecret) {
    const { ctx } = this;
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    const res = await ctx.curl(url, { dataType: 'json' });
    if (res?.data?.access_token) {
      console.log('* 已成功获取 AccessToken:  ', res.data.access_token);
      console.log('==============================');
      return res.data.access_token;
    }
    console.error('【社有小券 用户端】【ERROR】获取 access_token 失败: ', res);
    console.log('==============================');
    throw new Error(JSON.stringify(res));
  }
  /**
   * 刷新微信公众号的 ACCESS_TOKEN
   * @param {*} appid 
   * @param {*} appsecret 
   */
  async refreshWechatAccessToken(appid, appsecret){
    const { ctx } = this;
    /*获取access_token*/
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    const res = await ctx.curl(url, { dataType: 'json' });
    if(! res?.data?.access_token){
      throw new Error(JSON.stringify(res?.data));
    }
    /*jsapi_ticket*/
    const jsapi_url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${res.data.access_token}&type=jsapi`;
    const jsapi_res = await ctx.curl(jsapi_url, { dataType: 'json' });
    
    if (jsapi_res?.data?.ticket) {
      let data = {
        access_token:res.data.access_token,
        ticket: jsapi_res.data.ticket
      }
      console.log(" 【社有 global 端】 jsapi凭证、ticket票据调用成功... ",data)
      return data;
    }
    console.error('【锦鲤分享页面】【ERROR】获取 access_token 失败: ', res);
    console.error('【锦鲤分享页面】【ERROR】获取 jsapi_ticket 失败: ', jsapi_res);
    throw new Error(JSON.stringify(res));
  }


}

module.exports = AccessService;
