
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TestLogo = app[modelName].define('test_logo', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pic_url: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'test_logo',
    timestamps: false,
  });

  TestLogo.associate = () => {
    // TestLogo.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TestLogo.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TestLogo;
};

