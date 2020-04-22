
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ActivityBanners = app[modelName].define('activity_banners', {
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
    priority: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(ActivityBanners.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'activity_banners',
    timestamps: false,
  });

  ActivityBanners.associate = () => {
    ActivityBanners.belongsTo(app[modelName].Activities, { foreignKey: 'activityid', targetKey: 'id', as: 'activity' });
    // ActivityBanners.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // ActivityBanners.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ActivityBanners;
};

