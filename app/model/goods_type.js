
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsType = app[modelName].define('goods_type', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    parent_code: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(GoodsType.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_type',
    timestamps: false,
  });

  GoodsType.associate = () => {
    GoodsType.hasMany(app[modelName].Goods, { foreignKey: 'good_type', targetKey: 'id' });
    // GoodsType.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsType.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsType;
};

