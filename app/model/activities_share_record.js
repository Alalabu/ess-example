
'use strict';
const moment = require('moment');
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ActivitiesShareRecord = app[modelName].define('activities_share_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    activityid: {
      type: DataTypes.STRING,
    },
    clientid: {
      type: DataTypes.STRING,
    },
    downloadimg: {
      type: DataTypes.STRING,
    },
    createAt: { // 使用结束时间
      type: DataTypes.DATE,
      get canuse_end() {
        return moment(ActivitiesShareRecord.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    tableName: 'activities_share_record',
    timestamps: false,
  });

  ActivitiesShareRecord.associate = () => {
    // City.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // City.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ActivitiesShareRecord;
};

