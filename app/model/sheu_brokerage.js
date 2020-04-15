
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SheuBrokerage = app[modelName].define('sheu_brokerage', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    mch_appid: {
      type: DataTypes.STRING,
    },
    mchid: {
      type: DataTypes.STRING,
    },
    device_info: {
      type: DataTypes.STRING,
    },
    partner_trade_no: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.STRING,
    },
    re_user_name: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.STRING,
    },
    spbill_create_ip: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SheuBrokerage.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    result_code: {
      type: DataTypes.STRING,
    },
    err_code: {
      type: DataTypes.STRING,
    },
    err_code_des: {
      type: DataTypes.STRING,
    },
    payment_no: {
      type: DataTypes.STRING,
    },
    payment_time: {
      type: DataTypes.DATE,
      get payment_time() {
        return moment(SheuBrokerage.getDataValue('payment_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    client_unionid: {
      type: DataTypes.STRING,
    },
    referrer_unionid: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'sheu_brokerage',
    timestamps: false,
  });

  SheuBrokerage.associate = () => {
    // SheuBrokerage.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SheuBrokerage.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SheuBrokerage;
};

