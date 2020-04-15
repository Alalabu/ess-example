
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const FishSharePrize = app[modelName].define('fish_share_prize', {
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
    type: {
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    is_draw: {
      type: DataTypes.INTEGER,
    },
    fs_id: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(FishSharePrize.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fish_share_prize',
    timestamps: false,
  });

  FishSharePrize.associate = () => {
    // FishSharePrize.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FishSharePrize.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FishSharePrize;
};

