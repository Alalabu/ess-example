
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreChangeRecord = app[modelName].define('store_change_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    master_id: {
      type: DataTypes.STRING,
    },
    origin_json: {
      type: DataTypes.STRING,
    },
    current_json: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    reason: {
      type: DataTypes.STRING,
    },
    audit_at: {
      type: DataTypes.DATE,
      get audit_at() {
        return moment(StoreChangeRecord.getDataValue('audit_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreChangeRecord.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_change_record',
    timestamps: false,
  });

  StoreChangeRecord.associate = () => {
    StoreChangeRecord.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    // StoreChangeRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreChangeRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreChangeRecord;
};

