
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreIncomeRecord = app[modelName].define('store_income_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    out_trade_no: {
      type: DataTypes.STRING,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    merchant_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    store_ratio: {
      type: DataTypes.INTEGER,
    },
    payed_fee: {
      type: DataTypes.INTEGER,
    },
    deduct_item: {
      type: DataTypes.STRING,
    },
    deduct_fee: {
      type: DataTypes.INTEGER,
    },
    actual_fee: {
      type: DataTypes.INTEGER,
    },
    remark: {
      type: DataTypes.STRING,
    },
    payed_at: {
      type: DataTypes.DATE,
      get payed_at() {
        return moment(StoreIncomeRecord.getDataValue('payed_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    orderdone_at: {
      type: DataTypes.DATE,
      get orderdone_at() {
        return moment(StoreIncomeRecord.getDataValue('orderdone_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreIncomeRecord.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_income_record',
    timestamps: false,
  });

  StoreIncomeRecord.associate = () => {
    StoreIncomeRecord.belongsTo(app[modelName].Order, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });
    StoreIncomeRecord.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    StoreIncomeRecord.belongsTo(app[modelName].WxMerchant, { foreignKey: 'merchant_id', targetKey: 'id' });
    StoreIncomeRecord.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    StoreIncomeRecord.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    StoreIncomeRecord.belongsTo(app[modelName].XqSubSeller, { foreignKey: 'seller_id', targetKey: 'id' });
    // StoreIncomeRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreIncomeRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreIncomeRecord;
};

