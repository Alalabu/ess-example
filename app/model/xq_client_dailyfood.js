
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqClientDailyfood = app[modelName].define('xq_client_dailyfood', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    store_name: {
      type: DataTypes.STRING,
    },
    goods_name: {
      type: DataTypes.STRING,
    },
    goods_pic: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    gcount: {
      type: DataTypes.INTEGER,
    },
    use_percent: {
      type: DataTypes.INTEGER,
    },
    pay_at: {
      type: DataTypes.DATE,
      get pay_at() {
        return moment(XqClientDailyfood.getDataValue('pay_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqClientDailyfood.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_client_dailyfood',
    timestamps: false,
  });

  XqClientDailyfood.associate = () => {
    XqClientDailyfood.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    XqClientDailyfood.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    XqClientDailyfood.belongsTo(app[modelName].Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    // XqClientDailyfood.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqClientDailyfood.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqClientDailyfood;
};

