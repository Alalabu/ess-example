
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const WxMerchant = app[modelName].define('wx_merchant', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    mch_id: {
      type: DataTypes.STRING,
    },
    mch_path: {
      type: DataTypes.STRING,
    },
    mch_secret: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    manager_id: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(WxMerchant.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'wx_merchant',
    timestamps: false,
  });

  WxMerchant.associate = () => {
    WxMerchant.hasMany(app[modelName].StoreArea, { foreignKey: 'merchant_id', targetKey: 'id' });
    // WxMerchant.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // WxMerchant.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return WxMerchant;
};

