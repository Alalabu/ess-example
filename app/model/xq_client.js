
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqClient = app[modelName].define('xq_client', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    unionid: {
      type: DataTypes.STRING,
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
    logourl: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(XqClient.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_client',
    timestamps: false,
  });

  XqClient.associate = () => {
    XqClient.hasMany(app[modelName].StoreSubscibe, { foreignKey: 'id', targetKey: 'clientid', as: 'storeSubscibe' });
    XqClient.hasMany(app[modelName].TicketDetailInfos, { foreignKey: 'id', targetKey: 'clientid', as: 'ticketDetailInfos' });
    XqClient.hasMany(app[modelName].Order, { foreignKey: 'clientid', targetKey: 'id', as: 'orders' });
    // XqClient.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqClient.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqClient;
};

