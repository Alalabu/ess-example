
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Partner = app[modelName].define('partner', {
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
    school_id: {
      type: DataTypes.INTEGER,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    realname: {
      type: DataTypes.STRING,
    },
    person_id: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Partner.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'partner',
    timestamps: false,
  });

  Partner.associate = () => {
    // Partner.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Partner.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Partner;
};

