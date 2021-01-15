'use strict';

const Controller = require('egg').Controller;
/**
 * Seller 商户部分管理
 */
class SellerController extends Controller {

  // 新增商户
  async createStore() {
    const { ctx } = this;
    const { area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
      can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin,
      can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude,
      start_time, stop_time, can_withdrawal, dining_id, withdrawal_ratio=100, zeronorm=990,
      printer_no } = ctx.request.body;
    if (!area_id || !longitude || !latitude || !store_name) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.createStore({ area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
      can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin,
      can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude,
      start_time, stop_time, can_withdrawal, dining_id, withdrawal_ratio, zeronorm,
      printer_no });
  }

  // 修改商户
  async updateStore() {
    const { ctx } = this;
    const { store_id, area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
      can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin,
      can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude,
      start_time, stop_time, can_withdrawal, dining_id, withdrawal_ratio, zeronorm,
      printer_no } = ctx.request.body;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.updateStore({ store_id, area_id, logourl, bgimgurl, tag_id, store_name, address, contact, detail, struts, biz_struts, 
      can_tablesign, can_change_struts, can_delivery, delivery_state, can_takeself, can_eatin,
      can_set_delivery_fee, delivery_fee, can_set_meal_fee, meal_fee, priority, longitude, latitude,
      start_time, stop_time, can_withdrawal, dining_id, withdrawal_ratio, zeronorm,
      printer_no });
  }

  // 删除商户
  async deleteStore() {
    const { ctx } = this;
    const { store_id } = ctx.request.body;
    if (!store_id) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.deleteStore({ store_id });
  }

  // 新增商户管理员
  async createSeller() {
    const { ctx } = this;
    const { store_id, username, gender, phonenum, level } = ctx.request.body;
    if (!store_id || !username || !gender || !phonenum || !level) {
      ctx.body = ctx.message.param.miss({ store_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.createSeller({ store_id, username, gender, phonenum, level });
  }

  // 修改商户管理员
  async updateSeller() {
    const { ctx } = this;
    const { seller_id, username, gender, phonenum, level, struts } = ctx.request.body;
    if (!seller_id) {
      ctx.body = ctx.message.param.miss({ seller_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.updateSeller({ seller_id, username, gender, phonenum, level, struts });
  }

  // 删除商户管理员
  async deleteSeller() {
    const { ctx } = this;
    const { seller_id } = ctx.request.body;
    if (!seller_id) {
      ctx.body = ctx.message.param.miss({ seller_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.deleteSeller({ seller_id });
  }

  async auditList() {
    const { ctx } = this;
    const { struts } = ctx.request.body;
    if (!struts) {
      ctx.body = ctx.message.param.miss({ struts });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.auditList({ struts });
  }

  async auditOne() {
    const { ctx } = this;
    const { record_id } = ctx.request.body;
    if (!record_id) {
      ctx.body = ctx.message.param.miss({ record_id });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.auditOne({ record_id });
  }

  async audit() {
    const { ctx } = this;
    const { area_id, record_id, apply_result, reason } = ctx.request.body;
    if (!area_id || !record_id || !apply_result) {
      ctx.body = ctx.message.param.miss({ area_id, record_id, apply_result, reason });
      return;
    }
    ctx.body = await ctx.service.manager.pa.seller.audit({area_id, record_id, apply_result, reason});
  }

  // async changeStruts() {
  //   const { ctx } = this;
  //   const { store_id, area_id, struts, biz_struts, can_tablesign, can_change_struts, can_set_delivery_fee, can_set_meal_fee  } = ctx.request.body;
  //   if (!store_id || !area_id) {
  //     ctx.body = ctx.message.param.miss({ store_id, area_id, struts, biz_struts, can_tablesign, can_change_struts, can_set_delivery_fee, can_set_meal_fe });
  //     return;
  //   }
  //   ctx.body = await ctx.service.pa.seller.changeStruts({ store_id, area_id, struts, biz_struts, can_tablesign, can_change_struts, can_set_delivery_fee, can_set_meal_fee });
  // }

  async addPrint() {
    const { ctx } = this;
    ctx.body = await ctx.service.manager.pa.seller.addPrint();
  }

  async testPrint() {
    const { ctx } = this;
    ctx.body = await ctx.service.manager.pa.seller.testPrint();
  }

  async removePrint() {
    const { ctx } = this;
    ctx.body = await ctx.service.manager.pa.seller.removePrint();
  }
}

module.exports = SellerController;
