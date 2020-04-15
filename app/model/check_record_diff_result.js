
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CheckRecordDiffResult = app[modelName].define('check_record_diff_result', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    crg_id: {
      type: DataTypes.STRING,
    },
    check_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    critical_value: {
      type: DataTypes.INTEGER,
    },
    current_num: {
      type: DataTypes.INTEGER,
    },
    replenishment: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(CheckRecordDiffResult.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'check_record_diff_result',
    timestamps: false,
  });

  CheckRecordDiffResult.associate = () => {
    // CheckRecordDiffResult.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // CheckRecordDiffResult.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return CheckRecordDiffResult;
};

