
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreArea = app[modelName].define('store_area', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    province_code: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    city_code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    parent_code: {
      type: DataTypes.STRING,
    },
    unify_delivery_fee: {
      type: DataTypes.INTEGER,
    },
    unify_meal_fee: {
      type: DataTypes.INTEGER,
    },
    stopbiz_at: { // 自动停止营业时间, null为禁用, 具体时间为启用
      type: DataTypes.STRING,
    },
    receivable_way: { // 商圈下商铺回款方式,merchant=统一微信商户,store=直接回款至商家
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreArea.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_area',
    timestamps: false,
  });

  StoreArea.associate = () => {
    StoreArea.hasMany(app[modelName].ManagerAreaRelation, { foreignKey: 'area_id', targetKey: 'id' });
    StoreArea.hasMany(app[modelName].XqStore, { foreignKey: 'area_id', targetKey: 'id' });
    StoreArea.hasMany(app[modelName].StoreDining, { foreignKey: 'area_id', targetKey: 'id' });
    StoreArea.belongsTo(app[modelName].WxMerchant, { foreignKey: 'merchant_id', targetKey: 'id' });
    // StoreArea.belongsTo(app[modelName].ManagerAreaRelation, { foreignKey: 'id', targetKey: 'area_id' });
    // StoreArea.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreArea.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreArea;
};

