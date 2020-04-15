
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreOutOrder = app[modelName].define('store_out_order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreOutOrder.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(StoreOutOrder.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_out_order',
    timestamps: false,
  });

  StoreOutOrder.associate = () => {
    // StoreOutOrder.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreOutOrder.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreOutOrder;
};

