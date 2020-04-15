
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const FishShare = app[modelName].define('fish_share', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sid: {
      type: DataTypes.INTEGER,
    },
    openid: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    imgurl: {
      type: DataTypes.STRING,
    },
    points: {
      type: DataTypes.INTEGER,
    },
    num: {
      type: DataTypes.INTEGER,
    },
    sub_get_num: {
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(FishShare.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(FishShare.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fish_share',
    timestamps: false,
  });

  FishShare.associate = () => {
    // FishShare.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FishShare.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FishShare;
};

