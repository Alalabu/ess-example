
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Dormitory = app[modelName].define('dormitory', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    drom_name: {
      type: DataTypes.STRING,
    },
    drom_num: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'dormitory',
    timestamps: false,
  });

  Dormitory.associate = () => {
    // Dormitory.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Dormitory.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Dormitory;
};

