'use strict';
const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const BaseService = require('../../base/base');

/**
 * 商圈管理
 */
class GmService extends BaseService {

  async create({username, gendar, phonenum, areas, email}) {
    const { ctx } = this;
    // 获取操作用户
    // const master_id = ctx.auth?.id;
    // if(!master_id) {
    //   return ctx.message.auth.noApiUser(ctx.auth);
    // }
    // 验证 areas 参数 Array<string>
    if (!_.isArray(areas)) {
      return ctx.message.param.invalid({username, areas}, 'areas must be Array<String>');
    }
    const { XqManager, ManagerAreaRelation } = ctx.model;
    // 确保手机号码不重复
    const otherManager = await XqManager.findAll({ where: { phonenum } });
    if(otherManager.length > 0) {
      return ctx.message.gm.repetition(otherManager.length);
    }
    // 开启事务
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 添加管理员
      const pa = await XqManager.create({
        id: ctx.uuid32, username, gendar, phonenum, email, struts: '1', level: 'common'
      }, { transaction });
      // 2. 添加商圈管理员关系
      for(let area_id of areas) {
        await ManagerAreaRelation.create({ id: ctx.uuid32, manager_id: pa.id, area_id }, { transaction });
      }
      await transaction.commit();
      return ctx.message.success(pa);
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  async update({ manager_id, username, gendar, phonenum, new_areas, del_areas, email }) {
    const { ctx } = this;
    if (new_areas && !_.isArray(new_areas)) {
      return ctx.message.param.invalid({username, new_areas}, 'new_areas must be Array<String>');
    }
    if (del_areas && !_.isArray(del_areas)) {
      return ctx.message.param.invalid({username, del_areas}, 'del_areas must be Array<String>');
    }
    const { XqManager, ManagerAreaRelation } = ctx.model;
    // 确保手机号码不重复
    const otherManager = await XqManager.findAll({ where: { phonenum, id: {[Op.ne]: manager_id} } });
    if(otherManager.length > 0) {
      return ctx.message.gm.repetition(otherManager.length);
    }
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 如果用户不存在则新增用户
      const validParams = _.omitBy({username, gendar, phonenum, email}, _.isNil);
      await XqManager.update(validParams , { where: { id: manager_id }, transaction });
      if (new_areas && _.isArray(new_areas)) {
        for(let area_id of new_areas) {
          await ManagerAreaRelation.create({ id: ctx.uuid32, manager_id, area_id }, { transaction });
        }
      }
      if (del_areas && _.isArray(del_areas)) {
        for(let area_id of del_areas) {
          await ManagerAreaRelation.destroy({ where: { manager_id, area_id }, transaction });
        }
      }
      await transaction.commit();
      return ctx.message.success();
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }

  async delete({ manager_id }) {
    const { ctx } = this;
    const { XqManager } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await XqManager.update({struts: '0'}, { where: { id: manager_id } });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

  async changeAuth({ origin_manager_id, new_manager_id }) {
    const { ctx } = this;
    const { ManagerAreaRelation } = ctx.model;
    const transaction = await ctx.model.transaction(); // 事务
    try {
      // 1. 如果用户不存在则新增用户
      const areaRelations = await ManagerAreaRelation.findAll({ where: { manager_id: origin_manager_id }, raw:true });
      if (areaRelations.length < 1) {
        return ctx.message.result.noData({ origin_manager_id, new_manager_id }, 'origin_manager_id 未绑定商圈');
      }
      for ( let rel of areaRelations) {
        const tmp = await ManagerAreaRelation.findOne({ where: {manager_id: new_manager_id, area_id: rel.area_id} });
        if (!tmp) {
          // 新管理员不存在重复数据, 可修改
          await ManagerAreaRelation.update({ manager_id: new_manager_id, area_id: rel.area_id }, {
            where: {
              manager_id: origin_manager_id, area_id: rel.area_id
            },
            transaction 
          });
        } else {
          // 新管理员已有重复的权限, 则删除旧管理员权限即可
          await ManagerAreaRelation.destroy({ where: { manager_id: origin_manager_id, area_id: rel.area_id }, transaction });
        }
        
      }
      // const result = await XqManager.update({struts: '0'}, { where: { id: manager_id } });
      await transaction.commit();
      return ctx.message.success();
    } catch (err) {
      await transaction.rollback();
      return ctx.message.exception(err);
    }
  }
  /**
   * 
   */
  async find({ manager_id }) {
    const { ctx } = this;
    const sequelize = ctx.model;
    const { XqManager, ManagerAreaRelation, StoreArea } = sequelize;
    try {
      // 1. 如果用户不存在则新增用户
      const include = [{
        model: ManagerAreaRelation, required: true, 
        attributes: { exclude: ['manager_id', 'area_id', 'school_id', 'create_at']},
        include: [{
          model: StoreArea, required: true,
        }]
      }];
      const result = await XqManager.findOne({ where: { id: manager_id }, include });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }
  /**
   * 
   */
  async findAll({ struts }) {
    const { ctx } = this;
    const { XqManager } = ctx.model;
    try {
      // 1. 如果用户不存在则新增用户
      const result = await XqManager.findAll({ where: _.omitBy({ struts }, _.isNil) });
      return ctx.message.success(result);
    } catch (err) {
      return ctx.message.exception(err);
    }
  }

}

module.exports = GmService;
