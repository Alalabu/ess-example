
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Activities = app[modelName].define('activities', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    storeid: {
      type: DataTypes.STRING,
    },
    publish_userid: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    publish: { // 审核状态
      type: DataTypes.INTEGER,
    },
    start_time: { // 抢单开始时间
      type: DataTypes.DATE,
      get start_time() {
        return moment(Activities.getDataValue('start_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    end_time: { // 抢单结束时间
      type: DataTypes.DATE,
      get end_time() {
        return moment(Activities.getDataValue('end_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Activities.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    goods_title: { // 商品名称
      type: DataTypes.STRING,
    },
    origin_price: { // 原价
      type: DataTypes.INTEGER,
    },
    spot_price: { // 现价(折扣价格)
      type: DataTypes.INTEGER,
    },
    coupon_count: { // 活动礼券数量
      type: DataTypes.INTEGER,
    },
    canuse_begin: { // 使用开始时间
      type: DataTypes.DATE,
      get canuse_begin() {
        return moment(Activities.getDataValue('canuse_begin')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    canuse_end: { // 使用结束时间
      type: DataTypes.DATE,
      get canuse_end() {
        return moment(Activities.getDataValue('canuse_end')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    referral_fee: { // 活动推荐费
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'activities',
    timestamps: false,
    // underscored: false,
  });

  Activities.associate = () => {
    Activities.belongsTo(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfo' });
    Activities.belongsTo(app[modelName].XqManager, { foreignKey: 'publish_userid', targetKey: 'id', as: 'xqManager' });
    Activities.belongsTo(app[modelName].ActivityBanners, { foreignKey: 'id', targetKey: 'activityid', as: 'activityBanner' });
    Activities.belongsTo(app[modelName].Order, { foreignKey: 'id', targetKey: 'activityid', as: 'myorder' });

    Activities.hasMany(app[modelName].ActivityPics, { foreignKey: 'activityid', targetKey: 'id', as: 'activityPics' });
    Activities.hasMany(app[modelName].TicketInfos, { foreignKey: 'activityid', targetKey: 'id', as: 'ticketInfos' });
    Activities.hasMany(app[modelName].Order, { foreignKey: 'activityid', targetKey: 'id', as: 'orders' });
    // Activities.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Activities.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Activities;
};

