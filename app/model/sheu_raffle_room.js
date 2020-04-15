
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SheuRaffleRoom = app[modelName].define('sheu_raffle_room', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    author_openid: {
      type: DataTypes.STRING,
    },
    author_localid: {
      type: DataTypes.STRING,
    },
    room_no: {
      type: DataTypes.INTEGER,
    },
    room_title: {
      type: DataTypes.STRING,
    },
    period: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SheuRaffleRoom.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'sheu_raffle_room',
    timestamps: false,
  });

  SheuRaffleRoom.associate = () => {
    // SheuRaffleRoom.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SheuRaffleRoom.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SheuRaffleRoom;
};

