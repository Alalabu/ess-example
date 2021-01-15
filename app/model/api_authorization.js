
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ApiAuthorization = app[modelName].define('api_authorization', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_key: {
      type: DataTypes.STRING,
    },
    user_secret: {
      type: DataTypes.STRING,
    },
    user_name: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(ApiAuthorization.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'api_authorization',
    timestamps: false,
  });

  ApiAuthorization.associate = () => {
    // ApiAuthorization.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // ApiAuthorization.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ApiAuthorization;
};

