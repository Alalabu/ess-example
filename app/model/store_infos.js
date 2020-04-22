
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreInfos = app[modelName].define('store_infos', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    unionid: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.STRING,
    },
    logourl: {
      type: DataTypes.STRING,
    },
    bgimgurl: {
      type: DataTypes.STRING,
    },
    qcodeurl: {
      type: DataTypes.STRING,
    },
    store_name: {
      type: DataTypes.STRING,
    },
    avg_price: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
    seller_name: {
      type: DataTypes.STRING,
    },
    seller_phone: {
      type: DataTypes.STRING,
    },
    seller_password: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    accuracy: {
      type: DataTypes.FLOAT,
    },
    altitude: {
      type: DataTypes.FLOAT,
    },
    verticalAccuracy: {
      type: DataTypes.FLOAT,
    },
    horizontalAccuracy: {
      type: DataTypes.FLOAT,
    },
    manager_id: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreInfos.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_infos',
    timestamps: false,
  });

  StoreInfos.associate = () => {
    StoreInfos.belongsTo(app[modelName].StoreCityRelation, { foreignKey: 'id', targetKey: 'storeid', as: 'storeCityRelation' });
    StoreInfos.belongsTo(app[modelName].XqManager, { foreignKey: 'manager_id', targetKey: 'id', as: 'xqManager' });
    // StoreInfos.belongsTo(app[modelName].StoreSubscibe, { foreignKey: 'foreignKey_id', targetKey: 'id' });

    StoreInfos.hasMany(app[modelName].StoreTagsRelation, { foreignKey: 'storeid', targetKey: 'id', as: 'storeTagsRelation' });
    StoreInfos.hasMany(app[modelName].StoreSubscibe, { foreignKey: 'storeid', targetKey: 'id', as: 'storeSubscibe' });
    StoreInfos.hasMany(app[modelName].Activities, { foreignKey: 'storeid', targetKey: 'id', as: 'activities' });
    StoreInfos.hasMany(app[modelName].Order, { foreignKey: 'storeid', targetKey: 'id', as: 'orders' });
    // StoreInfos.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreInfos.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreInfos;
};

