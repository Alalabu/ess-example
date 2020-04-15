
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SheuRaffleWinner = app[modelName].define('sheu_raffle_winner', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.STRING,
    },
    room_no: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    trophy: {
      type: DataTypes.STRING,
    },
    people_count: {
      type: DataTypes.INTEGER,
    },
    exec_order: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SheuRaffleWinner.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sheu_raffle_winner',
    timestamps: false,
  });

  SheuRaffleWinner.associate = () => {
    // SheuRaffleWinner.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SheuRaffleWinner.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SheuRaffleWinner;
};

