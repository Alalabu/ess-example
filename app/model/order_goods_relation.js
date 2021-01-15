
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const OrderGoodsRelation = app[modelName].define('order_goods_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    out_trade_no: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    goods_title: {
      type: DataTypes.STRING,
    },
    total_fee: {
      type: DataTypes.INTEGER,
    },
    origin_fee: {
      type: DataTypes.INTEGER,
    },
    count: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(OrderGoodsRelation.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'order_goods_relation',
    timestamps: false,
  });

  OrderGoodsRelation.associate = () => {
    OrderGoodsRelation.belongsTo(app[modelName].Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    OrderGoodsRelation.belongsTo(app[modelName].Order, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });
    // OrderGoodsRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // OrderGoodsRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return OrderGoodsRelation;
};

