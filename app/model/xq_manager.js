
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqManager = app[modelName].define('xq_manager', {
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
    gendar: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqManager.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_manager',
    timestamps: false,
  });

  XqManager.associate = () => {
    XqManager.hasMany(app[modelName].ManagerAreaRelation, { foreignKey: 'manager_id', targetKey: 'id' });
    // XqManager.belongsTo(app[modelName].ManagerAreaRelation, { foreignKey: 'id', targetKey: 'manager_id' });
    // XqManager.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqManager.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqManager;
};

