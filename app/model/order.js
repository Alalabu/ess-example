
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Order = app[modelName].define('order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    clientid: {
      type: DataTypes.STRING,
    },
    storeid: {
      type: DataTypes.STRING,
    },
    activityid: {
      type: DataTypes.STRING,
    },
    out_refund_no: { // 退单单号
      type: DataTypes.STRING,
    },
    refund_fee: { // 退费金额
      type: DataTypes.INTEGER,
    },
    refund_desc: { // 退费原因
      type: DataTypes.STRING,
    },
    refundAt: { // 退费时间
      // type: DataTypes.STRING,
      type: DataTypes.DATE,
      get refundAt() {
        return moment(Order.getDataValue('refundAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    usestruts: {
      type: DataTypes.INTEGER,
    },
    total_fee: {
      type: DataTypes.INTEGER,
    },
    origin_fee: {
      type: DataTypes.INTEGER,
    },
    tags: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
    acode_url: {
      type: DataTypes.STRING,
    },
    prepayAt: {
      type: DataTypes.DATE,
      get prepayAt() {
        return moment(Order.getDataValue('prepayAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    payAt: {
      type: DataTypes.DATE,
      get payAt() {
        return moment(Order.getDataValue('payAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    payfailAt: {
      type: DataTypes.DATE,
      get payfailAt() {
        return moment(Order.getDataValue('payfailAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    payfailReason: {
      type: DataTypes.STRING,
    },
    useAt: {
      type: DataTypes.DATE,
      get useAt() {
        return moment(Order.getDataValue('useAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Order.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    referral_client: { // 推荐用户
      type: DataTypes.STRING,
    },
    referral_fee: { // 活动推荐费
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'order',
    timestamps: false,
  });

  Order.associate = () => {
    Order.belongsTo(app[modelName].Activities, { foreignKey: 'activityid', targetKey: 'id', as: 'activity' });
    Order.belongsTo(app[modelName].XqClient, { foreignKey: 'clientid', targetKey: 'id', as: 'client' });
    Order.belongsTo(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfo' });
    // Order.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Order.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Order;
};

