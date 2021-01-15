'use strict';
const BaseService = require('../base/base');

/**
 * 获取微信的 access_token
 * @param {object} ctx Context对象
 */
class WxmenuService extends BaseService {
  /**
   * 生成公众号所需的菜单
   *
   */
  async buildMenu() {
    const { ctx } = this;

    try {
      // const sheuwx_access_url = `https://shoppartner.she-u.cn/global/sheugzhAccessToken`;
      const key = '1e145f0a8f4711eabe3100ff9846b53f';
      const secret = '1e145f108f4711eabe3100ff9846b53f';
      const timeStamp = ctx.timeStamp;
      const nonceStr = ctx.getNonceStr(16);
      const sign = ctx.parseSign({key, timeStamp, nonceStr}, secret);
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhhaW91IiwiaWF0IjoxNTg4MjM2ODg1LCJleHAiOjE2MTk3NzI4ODV9.JPIf2LgLawqRhkBv-68R_3-sNBYemgfMMTSIz1uznts';
      const headers = {
        authorization: token,
      };

      const sheuwx_access_url = `http://she-u.cn/wechat/official/accessToken`;
      const access_token_res = await ctx.curl(sheuwx_access_url, {
        method: 'POST',
        dataType: 'json',
        data: {
          key, timeStamp, nonceStr, sign
        },
        headers,
      });
      // const access_token = '33_N7hrbZgbY_KoVgGZpWyTQg7mAYf-GR4953mgTJaMBrjiILQrDh2X8OVeGTRH8yXg9BvkcpHK97mAHEoErx6bUXTE6z3KSfEa_4Gsdww7dV9ATtY5oyxKonOfnQr-zkxgwhOJGi8tK0n9_W2RGWMaACAWMC';
      const access_token = access_token_res.data.data.access_token;
      console.log('生成菜单 - ACCESS_TOKEN : ', access_token);
      // 生成菜单
      const menuData = {
        button: [
          // {
          //   name: "社有食纪",
          //   type: "click",
          //   key: "SYSJ",
          // },
          {
            type: "miniprogram",
            name: "社有食纪",
            url: "https://www.she-u.cn/404",
            appid: "wxcf0228511283435a",
            pagepath: "pages/guide/guide",
          },
          // {
          //     name: "小工具",
          //     sub_button: [
          //         {
          //             type: "miniprogram",
          //             name: "云社团",
          //             url: "https://www.she-u.cn/404",
          //             appid: "wxf22545deb852c577",
          //             pagepath: "pages/guide/guide",
          //         },
          //         {
          //             type: "view",
          //             name: "云抽奖",
          //             url: "https://shoppartner.she-u.cn/raffle/index"
          //         },
          //     ]
          // },

          // {
          //   name: "零食小铺",
          //   type: "miniprogram",
          //   url: "https://www.she-u.cn/404",
          //   appid: "wxcf0228511283435a",
          //   pagepath: "pages/index/index",
          // },
          // {
          //   name: "天天会员日",
          //   type: "miniprogram",
          //   url: "https://www.she-u.cn/404",
          //   appid: "wxe8235731204bc54c",
          //   pagepath: "pages/guide/guide",
          // }

          // ,{
          //     name: "锦鲤帮你买单",
          //     type: "view",
          //     url: "https://g.she-u.cn/public/share/getCode",
          // }
          // ,{
          //     name: "锦鲤吖",
          //     sub_button: [
          //         {
          //             type: "view",
          //             name: "立即抽奖",
          //             url: "https://g.she-u.cn/public/share/getCode",
          //         },{
          //             type: "click",
          //             name: "+加概率+",
          //             key: "activitySign",
          //             url: "https://g.she-u.cn/public/share/getCode",
          //         },
          //     ]
          // },
        ]
      };
      const build_menu_url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
      const build_menu_res = await ctx.curl(build_menu_url, {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(menuData),
      });

      console.log('生成菜单 - BUILD_MENU : ', build_menu_res);
      const build_res = build_menu_res.data;
      ctx.body = build_res;
    } catch (error) {
      ctx.body = { error };
    }
  }
}

module.exports = WxmenuService;