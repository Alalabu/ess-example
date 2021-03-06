
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
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqClient.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_client',
    timestamps: false,
  });

  XqClient.associate = () => {
    XqClient.hasMany(app[modelName].Address, { foreignKey: 'client_id', targetKey: 'id' });
    XqClient.hasMany(app[modelName].XqClientNst, { foreignKey: 'client_id', targetKey: 'id' });
    XqClient.hasMany(app[modelName].OrderComment, { foreignKey: 'client_id', targetKey: 'id' });
    // XqClient.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqClient.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqClient;
};

