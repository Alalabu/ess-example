
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
    client_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreSubscibe.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_subscibe',
    timestamps: false,
  });

  StoreSubscibe.associate = () => {
    StoreSubscibe.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    StoreSubscibe.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    // StoreSubscibe.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreSubscibe.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreSubscibe;
};

