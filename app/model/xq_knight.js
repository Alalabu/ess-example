
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqKnight = app[modelName].define('xq_knight', {
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
    pid: {
      type: DataTypes.STRING,
    },
    phonenum: {
      type: DataTypes.STRING,
    },
    logourl: {
      type: DataTypes.STRING,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqKnight.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_knight',
    timestamps: false,
  });

  XqKnight.associate = () => {
    // XqKnight.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqKnight.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqKnight;
};

