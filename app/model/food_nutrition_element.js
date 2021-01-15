
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  /**
   * 营养标准: 元素关联
   */
  const FoodNutritionElement = app[modelName].define('food_nutrition_element', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    standard_id: {
      type: DataTypes.STRING,
    },
    name_zh: {
      type: DataTypes.STRING,
    },
    name_en: {
      type: DataTypes.STRING,
    },
    name_code: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    min_value: {
      type: DataTypes.FLOAT,
    },
    suggest_value: {
      type: DataTypes.FLOAT,
    },
    max_value: {
      type: DataTypes.FLOAT,
    },
    unit: {
      type: DataTypes.STRING,
    },
    has_weight: {
      type: DataTypes.STRING,
    },
    weight_ratio: {
      type: DataTypes.FLOAT,
    },
    has_calc: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    lack_detail: {
      type: DataTypes.STRING,
    },
    excess_detail: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(FoodNutritionElement.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'food_nutrition_element',
    timestamps: false,
  });

  FoodNutritionElement.associate = () => {
    FoodNutritionElement.belongsTo(app[modelName].FoodNutritionStandard, { foreignKey: 'standard_id', targetKey: 'id' });
    // FoodStandardElement.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FoodStandardElement.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FoodNutritionElement;
};

