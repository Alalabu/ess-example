
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ActivityPics = app[modelName].define('activity_pics', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    activityid: {
      type: DataTypes.STRING,
    },
    picurl: {
      type: DataTypes.STRING,
    },
    aspect_ratio: {
      type: DataTypes.FLOAT,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(ActivityPics.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'activity_pics',
    timestamps: false,
  });

  ActivityPics.associate = () => {
    ActivityPics.belongsTo(app[modelName].Activities, { foreignKey: 'activityid', targetKey: 'id', as: 'activities' });
    // ActivityPics.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // ActivityPics.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ActivityPics;
};

