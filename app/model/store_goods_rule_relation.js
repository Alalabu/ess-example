
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreGoodsRuleRelation = app[modelName].define('store_goods_rule_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    rule_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    limit_num: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreGoodsRuleRelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(StoreGoodsRuleRelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_goods_rule_relation',
    timestamps: false,
  });

  StoreGoodsRuleRelation.associate = () => {
    // StoreGoodsRuleRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreGoodsRuleRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreGoodsRuleRelation;
};

