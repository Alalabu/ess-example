
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreSubscibe = app[modelName].define('store_subscibe', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    clientid: {
      type: DataTypes.STRING,
    },
    storeid: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreSubscibe.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_subscibe',
    timestamps: false,
  });

  StoreSubscibe.associate = () => {
    StoreSubscibe.belongsTo(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfo' });
    StoreSubscibe.belongsTo(app[modelName].XqClient, { foreignKey: 'clientid', targetKey: 'id', as: 'xqClient' });
    // StoreSubscibe.hasMany(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfos' });
    // StoreSubscibe.hasMany(app[modelName].XqClient, { foreignKey: 'clientid', targetKey: 'id', as: 'xqClients' });
    // StoreSubscibe.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreSubscibe.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreSubscibe;
};

