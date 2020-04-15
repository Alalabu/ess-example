
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const City = app[modelName].define('city', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    provincecode: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'city',
    timestamps: false,
  });

  City.associate = () => {
    // City.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // City.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return City;
};

