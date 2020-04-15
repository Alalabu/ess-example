
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Orderstruts = app[modelName].define('orderstruts', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    out_trade_no: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    prev_status: {
      type: DataTypes.INTEGER,
    },
    prepay_time: {
      type: DataTypes.DATE,
      get prepay_time() {
        return moment(Orderstruts.getDataValue('prepay_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    prepay_fail_time: {
      type: DataTypes.DATE,
      get prepay_fail_time() {
        return moment(Orderstruts.getDataValue('prepay_fail_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    pay_time: {
      type: DataTypes.DATE,
      get pay_time() {
        return moment(Orderstruts.getDataValue('pay_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    pay_fail_time: {
      type: DataTypes.DATE,
      get pay_fail_time() {
        return moment(Orderstruts.getDataValue('pay_fail_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    client_receive_fail_time: {
      type: DataTypes.DATE,
      get client_receive_fail_time() {
        return moment(Orderstruts.getDataValue('client_receive_fail_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    client_receive_fail_reason: {
      type: DataTypes.STRING,
    },
    seller_receive_time: {
      type: DataTypes.DATE,
      get seller_receive_time() {
        return moment(Orderstruts.getDataValue('seller_receive_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    seller_receive_fail_time: {
      type: DataTypes.DATE,
      get seller_receive_fail_time() {
        return moment(Orderstruts.getDataValue('seller_receive_fail_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    seller_receive_fail_reason: {
      type: DataTypes.STRING,
    },
    knight_receive_time: {
      type: DataTypes.DATE,
      get knight_receive_time() {
        return moment(Orderstruts.getDataValue('knight_receive_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    knight_finish_time: {
      type: DataTypes.DATE,
      get knight_finish_time() {
        return moment(Orderstruts.getDataValue('knight_finish_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    client_refund_time: {
      type: DataTypes.DATE,
      get client_refund_time() {
        return moment(Orderstruts.getDataValue('client_refund_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    client_refund_reason: {
      type: DataTypes.STRING,
    },
    seller_refund_time: {
      type: DataTypes.DATE,
      get seller_refund_time() {
        return moment(Orderstruts.getDataValue('seller_refund_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    refund_finish_time: {
      type: DataTypes.DATE,
      get refund_finish_time() {
        return moment(Orderstruts.getDataValue('refund_finish_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Orderstruts.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    modify_time: {
      type: DataTypes.DATE,
      get modify_time() {
        return moment(Orderstruts.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'orderstruts',
    timestamps: false,
  });

  Orderstruts.associate = () => {
    // Orderstruts.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Orderstruts.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Orderstruts;
};

