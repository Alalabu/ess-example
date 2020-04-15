
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const RushActivity = app[modelName].define('rush_activity', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    partner_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    struts_show: {
      type: DataTypes.INTEGER,
    },
    begin_show: {
      type: DataTypes.DATE,
      get begin_show() {
        return moment(RushActivity.getDataValue('begin_show')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    end_show: {
      type: DataTypes.DATE,
      get end_show() {
        return moment(RushActivity.getDataValue('end_show')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    begin_rush: {
      type: DataTypes.DATE,
      get begin_rush() {
        return moment(RushActivity.getDataValue('begin_rush')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    end_rush: {
      type: DataTypes.DATE,
      get end_rush() {
        return moment(RushActivity.getDataValue('end_rush')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(RushActivity.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'rush_activity',
    timestamps: false,
  });

  RushActivity.associate = () => {
    // RushActivity.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // RushActivity.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return RushActivity;
};

