
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Schoolactivation = app[modelName].define('schoolactivation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    state: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'schoolactivation',
    timestamps: false,
  });

  Schoolactivation.associate = () => {
    // Schoolactivation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Schoolactivation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Schoolactivation;
};

