'use strict';

const Controller = require('egg').Controller;
/**
 * 处理商户管理者相关事务
 */
class SellerController extends Controller {

  /**
   * 商户(敏感)信息修改申请
   */
  async infoApply() {
    const { ctx } = this;
    const { store_id, logourl, store_name, category, area_id, address, longitude, latitude, contcat
      , seller_name, seller_phone, license, detail} = ctx.request.body;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.seller.infoApply({store_id, logourl, store_name, category, area_id, address, longitude, latitude, contcat
      , seller_name, seller_phone, license, detail});
  }

  /**
   * 商户(非敏感)信息立即修改
   */
  async infoUpdate() {
    const { ctx } = this;
    const { store_id, biz_struts, can_delivery, can_takeself, can_eatin, delivery_fee, meal_fee, auto_takeorder, 
      start_time, stop_time, zeronorm} = ctx.request.body;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id, biz_struts, can_delivery, can_takeself, 
        can_eatin, delivery_fee, meal_fee, auto_takeorder, start_time, stop_time, zeronorm});
      return;
    }
    ctx.body = await ctx.service.seller.infoUpdate({ store_id, biz_struts, can_delivery, can_takeself, can_eatin, 
      delivery_fee, meal_fee, auto_takeorder, start_time, stop_time, zeronorm});
  }

  /**
   * 添加子账号
   */
  async createSubAccount() {
    const { ctx } = this;
    const { store_id, username, gender, phonenum } = ctx.request.body;
    if (!store_id || !username || !gender || !phonenum) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.seller.createSubAccount({ store_id, username, gender, phonenum });
  }

  /**
   * 变更子账号状态
   */
  async changeSubStruts() {
    const { ctx } = this;
    const { sub_id, struts } = ctx.request.body;
    if (!sub_id || !struts) {
      ctx.body = ctx.message.param.miss({ sub_id, struts });
      return;
    }
    ctx.body = await ctx.service.seller.changeSubStruts({ sub_id, struts });
  }

  /**
   * 删除子账户
   */
  // async deleteSubAccount() {
  //   const { ctx } = this;
  //   const { sub_id, struts } = ctx.request.body;
  //   if (!sub_id || !struts) {
  //     ctx.body = ctx.message.param.miss({ sub_id, struts });
  //     return;
  //   }
  //   ctx.body = await ctx.service.seller.deleteSubAccount({ sub_id, struts });
  // }

  /**
   * 查询子账号列表
   */
  async findSubAccounts() {
    const { ctx } = this;
    const { store_id, struts } = ctx.query;
    if (!store_id || !struts) {
      ctx.body = ctx.message.param.miss({ store_id, struts });
      return;
    }
    ctx.body = await ctx.service.seller.findSubAccounts({ store_id, struts });
  }

}

module.exports = SellerController;
