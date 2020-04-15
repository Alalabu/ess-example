
'use strict';
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TestPic = app[modelName].define('test_pic', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    pic_url: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'test_pic',
    timestamps: false,
  });

  TestPic.associate = () => {
    // TestPic.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TestPic.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TestPic;
};

