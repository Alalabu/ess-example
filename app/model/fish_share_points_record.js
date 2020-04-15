
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const FishSharePointsRecord = app[modelName].define('fish_share_points_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    fsp_id: {
      type: DataTypes.STRING,
    },
    before_num: {
      type: DataTypes.INTEGER,
    },
    now_num: {
      type: DataTypes.INTEGER,
    },
    reason: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(FishSharePointsRecord.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fish_share_points_record',
    timestamps: false,
  });

  FishSharePointsRecord.associate = () => {
    // FishSharePointsRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FishSharePointsRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FishSharePointsRecord;
};

