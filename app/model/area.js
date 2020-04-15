
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Area = app[modelName].define('area', {
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
    citycode: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'area',
    timestamps: false,
  });

  Area.associate = () => {
    // Area.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Area.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Area;
};

