
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqSubSeller = app[modelName].define('xq_sub_seller', {
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
    store_id: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqSubSeller.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_sub_seller',
    timestamps: false,
  });

  XqSubSeller.associate = () => {
    // XqSubSeller.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqSubSeller.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqSubSeller;
};

