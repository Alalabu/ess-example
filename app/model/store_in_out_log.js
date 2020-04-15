
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreInOutLog = app[modelName].define('store_in_out_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    in_out_status: {
      type: DataTypes.INTEGER,
    },
    history_num: {
      type: DataTypes.INTEGER,
    },
    change_num: {
      type: DataTypes.INTEGER,
    },
    new_num: {
      type: DataTypes.INTEGER,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    check_user_id: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      get createdAt() {
        return moment(StoreInOutLog.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(StoreInOutLog.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_in_out_log',
    timestamps: false,
  });

  StoreInOutLog.associate = () => {
    // StoreInOutLog.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreInOutLog.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreInOutLog;
};

