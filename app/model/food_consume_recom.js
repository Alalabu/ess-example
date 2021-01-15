
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const FoodConsumeRecom = app[modelName].define('food_consume_recom', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(FoodConsumeRecom.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'food_consume_recom',
    timestamps: false,
  });

  FoodConsumeRecom.associate = () => {
    // FoodConsumeRecom.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FoodConsumeRecom.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FoodConsumeRecom;
};

