
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StorehomeUser = app[modelName].define('storehome_user', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone_num: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StorehomeUser.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'storehome_user',
    timestamps: false,
  });

  StorehomeUser.associate = () => {
    // StorehomeUser.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StorehomeUser.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StorehomeUser;
};

