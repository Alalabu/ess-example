
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CheckRecordDiff = app[modelName].define('check_record_diff', {
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
    diff_count: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(CheckRecordDiff.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'check_record_diff',
    timestamps: false,
  });

  CheckRecordDiff.associate = () => {
    // CheckRecordDiff.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // CheckRecordDiff.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return CheckRecordDiff;
};

