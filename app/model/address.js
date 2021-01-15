
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Address = app[modelName].define('address', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    area_scope: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    is_default: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(Address.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = () => {
    // Address.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Address.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Address;
};

