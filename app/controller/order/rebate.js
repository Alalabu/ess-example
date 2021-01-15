'use strict';
const Controller = require('egg').Controller;

class RebateController extends Controller {

  /**
   * (用户端) 查询返利记录列表
   */
  async findRecordAll() {
    const { ctx } = this;
    let { area_id, limit, pindex } = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id, limit, pindex });
      return;
		}
		if (limit != null) limit = Number(limit);
		if (pindex != null) pindex = Number(pindex);
    ctx.body = await ctx.service.order.rebate.findRecordAll({ area_id, limit, pindex });
  }

  /**
   * (用户端) 查询返利规则列表
   */
  async findRebateAll() {
    const { ctx } = this;
    const { area_id } = ctx.query;
    if (!area_id) {
      ctx.body = ctx.message.param.miss({ area_id });
      return;
    }
    ctx.body = await ctx.service.order.rebate.findRebateAll({ area_id });
	}
	
	/**
   * (用户端) 查询返利规则详情单例
   */
  async findRebateOne() {
    const { ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      ctx.body = ctx.message.param.miss({ id });
      return;
    }
    ctx.body = await ctx.service.order.rebate.findRebateOne({ id });
  }

  // 新增模型的方法
	async add() {
		const {ctx} = this;
		// 获取参数
		const {area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, for_min, for_day, rebate_type, fee_num } = ctx.request.body;
		if (area_id == null || title == null || order_type == null || fee_max == null || fee_min == null || fee_ratio == null 
			|| people_num == null || for_hour == null || for_min == null || for_day == null || rebate_type == null || fee_num == null) {
			ctx.body = ctx.message.param.miss({area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, 
				for_min, for_day, rebate_type, fee_num});
			return;
		}
		ctx.body = await ctx.service.order.rebate.add({area_id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, 
			for_min, for_day, rebate_type, fee_num});
	}

	// 修改模型的方法
	async update() {
		const {ctx} = this;
		// 获取参数
		const {id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, for_min, for_day, struts, rebate_type, fee_num} = ctx.request.body;
		if (id == null || (title == null && order_type == null && fee_max == null && fee_min == null && fee_ratio == null 
			&& people_num == null && for_hour == null && for_min == null && for_day == null && struts == null
			&& rebate_type == null && fee_num == null)) {
			ctx.body = ctx.message.param.miss({id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, 
				for_min, for_day, struts, rebate_type, fee_num});
			return;
		}
		ctx.body = await ctx.service.order.rebate.update({id, title, order_type, fee_max, fee_min, fee_ratio, people_num, for_hour, 
			for_min, for_day, struts, rebate_type, fee_num});
	}

	// 删除模型的方法
	async remove() {
		const {ctx} = this;
		// 获取参数
		const { id } = ctx.request.body;
		if ( id == null ) {
			ctx.body = ctx.message.param.miss({ id });
			return;
		}
		ctx.body = await ctx.service.order.rebate.remove({ id });
	}

}

module.exports = RebateController;
