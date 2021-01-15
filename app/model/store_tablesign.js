
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreTablesign = app[modelName].define('store_tablesign', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    table_name: {
      type: DataTypes.STRING,
    },
    table_code: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreTablesign.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_tablesign',
    timestamps: false,
  });

  StoreTablesign.associate = () => {
    // StoreArea.belongsTo(app[modelName].ManagerAreaRelation, { foreignKey: 'area_id', targetKey: 'area_id' });
    // StoreTablesign.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreTablesign.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreTablesign;
};

