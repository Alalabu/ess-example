
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TestAvatar = app[modelName].define('test_avatar', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pic_url: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'test_avatar',
    timestamps: false,
  });

  TestAvatar.associate = () => {
    // TestAvatar.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TestAvatar.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TestAvatar;
};

