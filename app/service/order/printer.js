'use strict';
const BaseService = require('../base/base');
const qs = require('querystring');
const crypto = require('crypto');

const USER = "sheucn@163.com";//必填，飞鹅云 www.feieyun.cn后台注册的账号名
const UKEY = "IQTZnv7vxP3ICwZP";//必填，飞鹅云后台注册账号后生成的UKEY

//以下URL参数不需要修改
const HOST = "http://api.feieyun.cn";     //域名
//let PORT = "80";		         //端口
const URLPATH = `${HOST}/Api/Open/`;         //接口路径

/**
 * xxx 管理
 */
class PrinterService extends BaseService {

  async printing(sn1, orderInfo) {
    const { ctx } = this;
    // 获取操作用户
    let STIME = Math.floor(new Date().getTime() / 1000);//请求时间,当前时间的秒数
		let post_data = {
			user: USER,//账号
			stime: STIME,//当前时间的秒数，请求时间
			sig: crypto.createHash('sha1').update(USER + UKEY + STIME).digest('hex'),//签名
			apiname: "Open_printMsg",//不需要修改
			sn: sn1,//打印机编号
			content: orderInfo,//打印内容
			times: "1"//打印联数,默认为1
		};
		let content = qs.stringify(post_data);
    const url = URLPATH;
    return await ctx.curl(url, {
      dataType: 'json',
      method: 'POST',
      data: content,
      headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
    });
  }
}

module.exports = PrinterService;
