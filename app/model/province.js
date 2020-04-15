
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Province = app[modelName].define('province', {
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
  }, {
    tableName: 'province',
    timestamps: false,
  });

  Province.associate = () => {
    // Province.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Province.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Province;
};

