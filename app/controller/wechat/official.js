'use strict';
const crypto = require('crypto');
const getRawBody = require('raw-body');
const sha1 = require('sha1');
const xml2js = require('xml2js');
const { MP_ACCESS_TOKEN } = require('../../util/strings');
const Controller = require('egg').Controller;

const config = {
  wechat: {
    appID: 'wx18aa432769631379', // 填写你自己的appID
    appSecret: 'a864a627dcfbcc51cb5622d322edf8cf', // 填写你自己的appSecret
    EncodingAESKey: 'tZHiMcrZdPfVxjO717QQvg7fHMj0OjgUG6hHcKweqBD',
    token: 'sheyou', // 填写你自己的token
  },
};
// XML 解析配置
const XMLBuilder = new xml2js.Builder({
  rootName: 'xml',
  cdata: true,
  headless: true,
  renderOpts: {
    pretty: false,
  },
});
/**
 * 将参数、调用者 secret打包生成正确签名，并与发送的签名进行对比
 * @param {object} data 用户参数
 * @param {string} secret 用户密文
 * @param {string} sign 签名
 */
// const parseSign = (data, secret, sign) => {

//   // 1. 签名的 md5 解密(数据对比)
//   const md5 = crypto.createHash('md5');
//   const paramKeys = Object.keys(data);
//   paramKeys.sort();
//   const string1 = paramKeys.map((k) => data[k]).join('&');
//   const _sign = md5.update(`${string1}${secret}`).digest('hex');
//   // 4. 比对签名结果
//   return _sign === sign;
// };

// const validIn = ({signature, nonce, timestamp, echostr}) => {
//   const token = config.wechat.token;
//   const str = [token, timestamp, nonce].sort().join(''); // 按字典排序，拼接字符串
//   const sha = sha1(str); // 加密
//   return (sha === signature) ? echostr + '' : 'failed'; // 比较并返回结果
// }
/**
 * 负责对接公众号入口
 */
class OfficialController extends Controller {
  /**
   * 微信接入
   * https://g.she-u.cn/wechat/in
   */
  async getIn() {
    const ctx = this.ctx;

    const token = config.wechat.token;
    ctx.logger.info('| 微信接入 query ====> %s', JSON.stringify(ctx.query)); // ctx.request.body

    const signature = ctx.query.signature;
    const nonce = ctx.query.nonce;
    const timestamp = ctx.query.timestamp;
    const echostr = ctx.query.echostr;
    const str = [token, timestamp, nonce].sort().join(''); // 按字典排序，拼接字符串
    const sha = sha1(str); // 加密
    ctx.body = (sha === signature) ? echostr + '' : 'failed'; // 比较并返回结果
  }

  // async postIn2() {
  //   this.ctx.body = '3319161130907054045';
  // }
  /**
   * post 方式发送微信接入数据
   * https://g.she-u.cn/wechat/in
   */
  async postIn() {
    const ctx = this.ctx;
    // 数据验证部分
    try {
      // console.log('[postIn] 1111111111111');
      // const {signature, nonce, timestamp, echostr} = ctx.query;
      // if (signature && nonce && timestamp && echostr) {
      //   ctx.body = validIn({signature, nonce, timestamp, echostr});
      //   return;
      // }
      // ctx.logger.info('[postIn] 1.1 ctx.req: ', ctx.req);
      // ctx.logger.info('[postIn] 1.2 ctx.request: ', ctx.request);
      // console.log('[postIn] 2222222222');
      // ctx.logger.info('[postIn] 22222 ctx.request.body: ', ctx.request.body);
      // 数据交涉部分
      // const xml = await getRawBody(ctx.req, {
      //   length: ctx.request.length,
      //   limit: '1mb',
      //   encoding: ctx.request.charset || 'utf-8',
      // });
      // ctx.logger.info('[postIn] 3333333333 xml: ', xml);
      // const xmlParser = new xml2js.Parser({
      //   explicitArray: false
      // });
      // var cleanedString = xml.replace("\ufeff", "");
      // ctx.logger.info('[postIn] 4.0 cleanedString: ', cleanedString);
      // 获取推送事件的对象
      // const result = await new Promise((resolve, reject) => {
      //   xmlParser.parseString(xml, (err, success) => {
      //     if (err) {
      //       ctx.logger.info('[postIn] 4.1: ', err);
      //       reject(err);
      //     }
      //     ctx.logger.info('[postIn] 4.2: ', success);
      //     resolve(success.xml);
      //   });
      // });
      // ctx.logger.info('[postIn] 555555555555: ', result);
      const $options = ctx.request.body.$options;
      if(!$options || !$options.xml) {
        ctx.body = { msg: '没有找到有效的XML请求数据!' };
        return;
      }
      const result = $options.xml;
      // console.log('||||| 微信接入 result ====> ', result);
      ctx.logger.info('||||| 微信接入 body ====> %s', JSON.stringify(result));

      if (result.MsgType === 'text' || result.MsgType === 'image' || result.MsgType === 'voice' ||
        result.MsgType === 'video' || result.MsgType === 'shortvideo' ||
        result.MsgType === 'location' || result.MsgType === 'link') {
        /**
         * 当遇到 "客服"关键字时，会话接入客服
         */
        let xmlRes = null;
        if (result.MsgType === 'text' && result.Content && result.Content.indexOf('客服') === -1) {
          // 文本消息 -> 被动回执
          const user = await ctx.model.SheuUser.findOne({
            where: {
              openid: result.FromUserName,
            },
          });
          const sessionKey = (user && user.openid) ? (user.openid.replace(/-/g, '')) : ctx.uuid32;
          const aires = await ctx.service.wechat.nlpchat.textchat(sessionKey, result.Content);
          if (aires.ret === 0) {
            xmlRes = XMLBuilder.buildObject({
              ToUserName: result.FromUserName,
              FromUserName: result.ToUserName,
              CreateTime: result.CreateTime,
              MsgType: `text`,
              Content: aires.data.answer,
            });
            ctx.logger.info('||||| 微信接入 通过AI闲聊反馈 ====> %s', JSON.stringify(xmlRes));
            ctx.body = xmlRes;
            return;
          }
        }
        // 文本消息 -> 推送至客服
        xmlRes = XMLBuilder.buildObject({
          ToUserName: `${result.FromUserName}`,
          FromUserName: `${result.ToUserName}`,
          CreateTime: result.CreateTime,
          MsgType: 'transfer_customer_service',
        });
        // console.log('||||| 微信接入 返回数据 ====> ', xml_res);
        // ctx.logger.info('||||| 微信接入 返回数据 ==== xmlRes > %s', xmlRes);
        ctx.logger.info('||||| 微信接入 返回数据 ==== JSON.stringify(xmlRes) > %s', JSON.stringify(xmlRes));
        ctx.body = xmlRes;
        return;
      } else if (result.MsgType === 'event') {

        // 关注事件
        if (result.Event === 'subscribe') {
          // 关注事件 qrscene_ 推荐人部分
          // let referrerUnionid = '';
          // const flag = 'qrscene_';
          // if (result.EventKey && typeof result.EventKey === 'string' && result.EventKey.indexOf(flag) > -1) {
          //   referrerUnionid = result.EventKey.substring(
          //     flag.length, result.EventKey.length,
          //   );
          // }
          // console.log(`||||| 用户[${result.FromUserName}]已关注公众号，推荐人：[${referrer_unionid}] ====>`);
          // ctx.logger.info(`||||| 用户[${result.FromUserName}]已关注公众号，推荐人：[${referrerUnionid}] ====>`);
          // 检查该用户 result.FromUserName [openid] 是否拥有推荐人 [referrer_unionid]
          // 如果没有, 则写入
          // await this.writeWechatUser(result.FromUserName, referrerUnionid);
          await ctx.service.wechat.official.writeWechatUser(result.FromUserName);

          // 添加积分
          // await ctx.service.globalSupport.calcPoints(1, result);

          // 修改sheu关注表 关注1是取消0
          // await ctx.service.globalSupport.iSsubscribe(1, result);

          const xmlRes = XMLBuilder.buildObject({
            ToUserName: result.FromUserName,
            FromUserName: result.ToUserName,
            CreateTime: result.CreateTime,
            MsgType: `text`,
            Content: `你来啦，亲爱滴~ \n终于等到你\n你的【社有】致力于为你提供最好的线上生活服务，需要我们帮你做什么尽管戳我 yo ٩(๑> ₃ <)۶з \n【工作时间中】输入"客服"会转入人工小姐姐接(tiao)待(xi)模式吖\n　/) /)\nฅ(• - •)ฅ`,
          });
          ctx.logger.info('【subscribe】关注时的回执：', xmlRes);
          ctx.body = xmlRes;
          return;
        }
        else if (result.Event === 'CLICK' && result.EventKey === 'SYSJ') {
          const xmlRes = XMLBuilder.buildObject({
            ToUserName: result.FromUserName,
            FromUserName: result.ToUserName,
            CreateTime: result.CreateTime,
            MsgType: `text`,
            Content: `社有新版块正在努力研发中~ \n亲爱滴，您可以先发文字调戏我们的人工智能（zhang），他可以陪您聊很多很多哟！ \n今天想要聊点什么吖~~`,
          });
          ctx.body = xmlRes;
          return;
        }
        // else if (result.Event === 'CLICK' && result.EventKey === 'activitySign') { SYSJ
          // ctx.body = await ctx.service.globalSupport.postSheuGZHLink(result);
        // }
        // else if (result.Event === 'unsubscribe') {
        //   // 添加积分
        //   await ctx.service.globalSupport.calcPoints(0, result);
        //   await ctx.service.globalSupport.iSsubscribe(0, result);
        //   // 取消关注事件
        //   ctx.logger.info(`||||| 用户[${result.FromUserName}]取消取消关注公众号...`);
        // } 
        else if (result.Event === 'SCAN') {
          // 扫码进入公众号
          // console.log(`||||| 用户[${result.FromUserName}]取消取消关注公众号...`);
          // ctx.logger.info(`||||| 用户[${result.FromUserName}]取消取消关注公众号...`);
          const xmlRes = XMLBuilder.buildObject({
            ToUserName: result.FromUserName,
            FromUserName: result.ToUserName,
            CreateTime: result.CreateTime,
            MsgType: `text`,
            Content: `亲爱滴宝贝~ \n【工作时间中】输入"客服"可转入人工小姐姐接(tiao)待(xi)模式 \n今天想要聊点什么吖~~`,
          });
          ctx.body = xmlRes;
          return;
        }
      } else {
        // 其他情况?
        const xmlRes = XMLBuilder.buildObject({
          ToUserName: result.FromUserName,
          FromUserName: result.ToUserName,
          CreateTime: result.CreateTime,
          MsgType: `text`,
          Content: `亲爱滴宝贝~ \n【工作时间中】输入"客服"可转入人工小姐姐接(tiao)待(xi)模式 \n今天想要聊点什么吖~~`,
        });
        ctx.body = xmlRes;
        return;
      }

      ctx.body = { msg: '未知的操作' };
    } catch (error) {
      ctx.body = ctx.message.exception(error);
    }
  }

}

module.exports = OfficialController;