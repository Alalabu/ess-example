
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Knight = app[modelName].define('knight', {
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
    is_breakfast: {
      type: DataTypes.INTEGER,
    },
    is_snacks: {
      type: DataTypes.INTEGER,
    },
    is_lunch: {
      type: DataTypes.INTEGER,
    },
    is_supper: {
      type: DataTypes.INTEGER,
    },
    is_night: {
      type: DataTypes.INTEGER,
    },
    is_fruits: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Knight.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'knight',
    timestamps: false,
  });

  Knight.associate = () => {
    // Knight.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Knight.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Knight;
};

