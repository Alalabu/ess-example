
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  /**
   * 食物营养每日标准
   */
  const FoodNutritionStandard = app[modelName].define('food_nutrition_standard', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    rl: {
      type: DataTypes.FLOAT,
    },
    zf: {
      type: DataTypes.FLOAT,
    },
    dbz: {
      type: DataTypes.FLOAT,
    },
    shhf: {
      type: DataTypes.FLOAT,
    },
    ssxw: {
      type: DataTypes.FLOAT,
    },
    wssa: {
      type: DataTypes.FLOAT,
    },
    las: {
      type: DataTypes.FLOAT,
    },
    su: {
      type: DataTypes.FLOAT,
    },
    ys: {
      type: DataTypes.FLOAT,
    },
    wsfc: {
      type: DataTypes.FLOAT,
    },
    wsse: {
      type: DataTypes.FLOAT,
    },
    shc: {
      type: DataTypes.FLOAT,
    },
    lb: {
      type: DataTypes.FLOAT,
    },
    dgc: {
      type: DataTypes.FLOAT,
    },
    gai: {
      type: DataTypes.FLOAT,
    },
    mei: {
      type: DataTypes.FLOAT,
    },
    tei: {
      type: DataTypes.FLOAT,
    },
    meng: {
      type: DataTypes.FLOAT,
    },
    xin: {
      type: DataTypes.FLOAT,
    },
    tong: {
      type: DataTypes.FLOAT,
    },
    jia: {
      type: DataTypes.FLOAT,
    },
    ling: {
      type: DataTypes.FLOAT,
    },
    la: {
      type: DataTypes.FLOAT,
    },
    xi: {
      type: DataTypes.FLOAT,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(FoodNutritionStandard.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'food_nutrition_standard',
    timestamps: false,
  });

  FoodNutritionStandard.associate = () => {
    FoodNutritionStandard.hasMany(app[modelName].FoodNutritionElement, { foreignKey: 'standard_id', targetKey: 'id' });
    // FoodDailyStandard.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // FoodDailyStandard.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return FoodNutritionStandard;
};

