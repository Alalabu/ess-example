
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsFoodRel = app[modelName].define('goods_food_rel', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    goods_id: { // 对应商品ID
      type: DataTypes.STRING,
    },
    food_id: { // 对应食材ID
      type: DataTypes.INTEGER,
    },
    unit_num: { // 单位质量
      type: DataTypes.FLOAT,
    },
    unit_text: { // 单位文字
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(GoodsFoodRel.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_food_rel',
    timestamps: false,
  });

  GoodsFoodRel.associate = () => {
    GoodsFoodRel.belongsTo(app[modelName].Food, { foreignKey: 'food_id', targetKey: 'id' });
    GoodsFoodRel.belongsTo(app[modelName].Goods, { foreignKey: 'goods_id', targetKey: 'id' });
    // GoodsFoodRel.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsFoodRel.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsFoodRel;
};

