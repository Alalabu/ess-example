
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreCityRelation = app[modelName].define('store_city_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    storeid: {
      type: DataTypes.STRING,
    },
    province_code: {
      type: DataTypes.STRING,
    },
    city_code: {
      type: DataTypes.STRING,
    },
    district_code: {
      type: DataTypes.STRING,
    },
    province_name: {
      type: DataTypes.STRING,
    },
    city_name: {
      type: DataTypes.STRING,
    },
    district_name: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreCityRelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_city_relation',
    timestamps: false,
  });

  StoreCityRelation.associate = () => {
    StoreCityRelation.belongsTo(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfos' });
    // StoreCityRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreCityRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreCityRelation;
};

