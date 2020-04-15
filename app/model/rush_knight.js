
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const RushKnight = app[modelName].define('rush_knight', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    activity_id: {
      type: DataTypes.STRING,
    },
    knight_id: {
      type: DataTypes.STRING,
    },
    predict_order_count: {
      type: DataTypes.INTEGER,
    },
    done_order_count: {
      type: DataTypes.INTEGER,
    },
    goods_stat: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(RushKnight.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'rush_knight',
    timestamps: false,
  });

  RushKnight.associate = () => {
    // RushKnight.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // RushKnight.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return RushKnight;
};

