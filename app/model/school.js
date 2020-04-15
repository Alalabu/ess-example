
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const School = app[modelName].define('school', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    uName: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.STRING,
    },
    lng: {
      type: DataTypes.STRING,
    },
    province: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    province_code: {
      type: DataTypes.STRING,
    },
    city_code: {
      type: DataTypes.STRING,
    },
    district_code: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'school',
    timestamps: false,
  });

  School.associate = () => {
    // School.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // School.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return School;
};

