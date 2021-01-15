'use strict';
const BaseService = require('../base/base');
const { MP_ACCESS_TOKEN } = require('../../util/strings');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class OfficialService extends BaseService {
  /**
   * 写入关注用户
   */
  async writeWechatUser(openid) {
    const ctx = this.ctx;
    let userInfoRes = null;
    try {
      const access_token = await ctx.app.registryClient.getConfig(MP_ACCESS_TOKEN);

      // 2. 获取该用户的 unionid
      const userInfoUrl = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
      ctx.logger.info('〓 3.0. 公众号userInfoUrl : ', userInfoUrl);
      userInfoRes = await ctx.curl(userInfoUrl, {
        dataType: 'json'
      });
      ctx.logger.info('〓 3.5. 公众号openid换取unionid结果 : ', JSON.stringify(userInfoRes));
      let sheuUser = userInfoRes.data;
      if (sheuUser && sheuUser.unionid) {
        // ctx.logger.info('〓 4. 公众号真正写入用户]: ', sheuUser.unionid);
        sheuUser = {
          ...sheuUser,
          is_subscribe: 1
        };
        delete sheuUser.tagid_list;
        sheuUser.id = ctx.uuid32;
        // 如果数据库没有此人, 则写入此人并且写入推荐人
        const sheuOk = await ctx.model.SheuUser.findOrCreate({
          where: {
            openid: sheuUser.openid,
            unionid: sheuUser.unionid,
          },
          defaults: sheuUser,
        });
        ctx.logger.info('【写入用户】结果: ', JSON.stringify(sheuOk));
        return ctx.message.success();
      } else {
        // 写入用户数据失败
        return ctx.message.official.writeUserFail(userInfoRes);
      }
    } catch (error) {
      ctx.logger.error(`||||| 用户[${openid}]写入关注公众号数据失败...`, error);
    }
  }
}

module.exports = OfficialService;
