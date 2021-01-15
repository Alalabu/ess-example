
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const OrderReceivable = app[modelName].define('order_receivable', {
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
    client_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    payed_fee: {
      type: DataTypes.INTEGER,
    },
    receivable_fee: {
      type: DataTypes.INTEGER,
    },
    orderstruts: {
      type: DataTypes.STRING,
    },
    payed_at: {
      type: DataTypes.DATE,
      get payed_at() {
        return moment(OrderReceivable.getDataValue('payed_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    receivable_at: {
      type: DataTypes.DATE,
      get receivable_at() {
        return moment(OrderReceivable.getDataValue('receivable_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    remark: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(OrderReceivable.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'order_receivable',
    timestamps: false,
  });

  OrderReceivable.associate = () => {
    OrderReceivable.belongsTo(app[modelName].Order, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });
    OrderReceivable.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    OrderReceivable.belongsTo(app[modelName].WxMerchant, { foreignKey: 'merchant_id', targetKey: 'id' });
    OrderReceivable.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    OrderReceivable.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    OrderReceivable.belongsTo(app[modelName].XqSubSeller, { foreignKey: 'seller_id', targetKey: 'id' });
    // OrderReceivable.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // OrderReceivable.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return OrderReceivable;
};

