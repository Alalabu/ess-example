
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreTagsOrder = app[modelName].define('store_tags_order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    storetag_id: {
      type: DataTypes.STRING,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreTagsOrder.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_tags_order',
    timestamps: false,
  });

  StoreTagsOrder.associate = () => {
    // StoreTagsOrder.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreTagsOrder.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreTagsOrder;
};

