
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreDining = app[modelName].define('store_dining', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreDining.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_dining',
    timestamps: false,
  });

  StoreDining.associate = () => {
    StoreDining.hasMany(app[modelName].XqStore, { foreignKey: 'dining_id', targetKey: 'id' });
    
    // Banners.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Banners.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreDining;
};

