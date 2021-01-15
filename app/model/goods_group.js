
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsGroup = app[modelName].define('goods_group', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(GoodsGroup.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_group',
    timestamps: false,
  });

  GoodsGroup.associate = () => {
    GoodsGroup.hasMany(app[modelName].Goods, { foreignKey: 'group_id', targetKey: 'id' });
    // GoodsType.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsType.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsGroup;
};

