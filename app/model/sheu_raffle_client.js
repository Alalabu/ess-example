
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SheuRaffleClient = app[modelName].define('sheu_raffle_client', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_openid: {
      type: DataTypes.STRING,
    },
    user_localid: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    tel: {
      type: DataTypes.STRING,
    },
    room_id: {
      type: DataTypes.STRING,
    },
    room_no: {
      type: DataTypes.INTEGER,
    },
    room_role: {
      type: DataTypes.INTEGER,
    },
    socket_id: {
      type: DataTypes.STRING,
    },
    awards_id: {
      type: DataTypes.STRING,
    },
    awards_created: {
      type: DataTypes.DATE,
      get awards_created() {
        return moment(SheuRaffleClient.getDataValue('awards_created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SheuRaffleClient.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sheu_raffle_client',
    timestamps: false,
  });

  SheuRaffleClient.associate = () => {
    // SheuRaffleClient.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SheuRaffleClient.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SheuRaffleClient;
};

