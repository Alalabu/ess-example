
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsChannel = app[modelName].define('goods_channel', {
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
    priority: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(GoodsChannel.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_channel',
    timestamps: false,
  });

  GoodsChannel.associate = () => {
    GoodsChannel.hasMany(app[modelName].Goods, { foreignKey: 'channel_id', targetKey: 'id' });
    // GoodsChannel.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsChannel.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsChannel;
};

