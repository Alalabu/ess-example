
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreWithdrawalRecord = app[modelName].define('store_withdrawal_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    seller_name: {
      type: DataTypes.STRING,
    },
    seller_phonenum: {
      type: DataTypes.STRING,
    },
    history_fee: {
      type: DataTypes.INTEGER,
    },
    current_fee: {
      type: DataTypes.INTEGER,
    },
    total_fee: {
      type: DataTypes.INTEGER,
    },
    surplus_fee: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreWithdrawalRecord.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_withdrawal_record',
    timestamps: false,
  });

  StoreWithdrawalRecord.associate = () => {
    StoreWithdrawalRecord.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    StoreWithdrawalRecord.belongsTo(app[modelName].XqSubSeller, { foreignKey: 'seller_id', targetKey: 'id' });
    // StoreWithdrawalRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreWithdrawalRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreWithdrawalRecord;
};

