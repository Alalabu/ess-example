
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ErrStoreIncomeStat = app[modelName].define('err_store_income_stat', {
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
    store_income: {
      type: DataTypes.INTEGER,
    },
    store_withdrawal: {
      type: DataTypes.INTEGER,
    },
    store_balance: {
      type: DataTypes.INTEGER,
    },
    stat_income: {
      type: DataTypes.INTEGER,
    },
    stat_withdrawal: {
      type: DataTypes.INTEGER,
    },
    stat_balance: {
      type: DataTypes.INTEGER,
    },
    desc: {
      type: DataTypes.STRING,
    },
    result_struts: {
      type: DataTypes.STRING,
    },
    result_desc: {
      type: DataTypes.STRING,
    },
    manager_id: {
      type: DataTypes.STRING,
    },
    result_at: {
      type: DataTypes.DATE,
      get result_at() {
        return moment(ErrStoreIncomeStat.getDataValue('result_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(ErrStoreIncomeStat.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'err_store_income_stat',
    timestamps: false,
  });

  ErrStoreIncomeStat.associate = () => {
    ErrStoreIncomeStat.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    ErrStoreIncomeStat.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    ErrStoreIncomeStat.belongsTo(app[modelName].XqManager, { foreignKey: 'manager_id', targetKey: 'id' });
    // ErrStoreIncomeStat.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // ErrStoreIncomeStat.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ErrStoreIncomeStat;
};

