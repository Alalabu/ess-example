const {
  MP_ACCESS_TOKEN, MP_JSAPI_TICKET,
  SJ_CLIENT_ACCESS_TOKEN, SJ_SELLER_ACCESS_TOKEN
} = require('../util/strings');
const ShiJiApp = require('../util/client-apps');
const { Official, Client, Seller } = ShiJiApp;
/**
 * 用于刷新 ACCESS_TOKEN
 */
module.exports = app => {
  return {
    schedule: {
      disable: (app.config.env !== 'prod'),
      // disable: true,
      interval: '90m',
      immediate: true, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
      type: 'worker', // run in all workers
      env: ['prod'],
    },
    async task(ctx) {
      const registryClient = ctx.app.registryClient;
      // 刷新 sj_client
      try {
        const sjat_client = await ctx.service.access.refreshMiniprogramAccessToken(Client.appid, Client.appsecret);
        console.log('[刷新Token Success][SJ_CLIENT_ACCESS_TOKEN] => ', sjat_client);
        registryClient.publish({
          dataId: SJ_CLIENT_ACCESS_TOKEN,
          publishData: sjat_client,
        });
      } catch (error) {
        ctx.logger.error('[刷新Token Error][SJ_CLIENT_ACCESS_TOKEN] => ', error);
      }

      // 刷新 sj_seller
      try {
        const sjat_seller = await ctx.service.access.refreshMiniprogramAccessToken(Seller.appid, Seller.appsecret);
        console.log('[刷新Token Success][SJ_SELLER_ACCESS_TOKEN] => ', sjat_seller);
        registryClient.publish({
          dataId: SJ_SELLER_ACCESS_TOKEN,
          publishData: sjat_seller,
        });
      } catch (error) {
        ctx.logger.error('[刷新Token Error][SJ_SELLER_ACCESS_TOKEN] => ', error);
      }

      // 刷新 Official 公众号
      try {
        const {access_token, ticket} = await ctx.service.access.refreshWechatAccessToken(Official.appid, Official.appsecret);
        console.log('[刷新Token Success][MP_ACCESS_TOKEN] => ', {access_token, ticket});
        registryClient.publish({
          dataId: MP_ACCESS_TOKEN,
          publishData: access_token,
        });
        registryClient.publish({
          dataId: MP_JSAPI_TICKET,
          publishData: ticket,
        });
      } catch (error) {
        ctx.logger.error('[刷新Token Error][MP_ACCESS_TOKEN] => ', error);
      }
    }
  }
};