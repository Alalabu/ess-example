
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Dormitorysupplierrelation = app[modelName].define('dormitorysupplierrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    suppli_id: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'dormitorysupplierrelation',
    timestamps: false,
  });

  Dormitorysupplierrelation.associate = () => {
    // Dormitorysupplierrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Dormitorysupplierrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Dormitorysupplierrelation;
};

