
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Schooladd = app[modelName].define('schooladd', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: {
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
    name: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'schooladd',
    timestamps: false,
  });

  Schooladd.associate = () => {
    // Schooladd.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Schooladd.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Schooladd;
};

