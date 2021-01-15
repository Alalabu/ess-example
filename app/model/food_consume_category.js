
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  /**
   * 营养消耗(体能及运动)类别
   */
  const FoodConsumeCategory = app[modelName].define('food_consume_category', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    category: { // 消耗方式分类
      type: DataTypes.STRING,
    },
    title: { // 类别名称
      type: DataTypes.STRING,
    },
    code: { // 类别标签
      type: DataTypes.STRING,
    },
    detail: { // 详细描述
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(FoodConsumeCategory.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'food_consume_category',
    timestamps: false,
  });

  FoodConsumeCategory.associate = () => {
    // FoodSportCategory.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FoodSportCategory.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FoodConsumeCategory;
};

