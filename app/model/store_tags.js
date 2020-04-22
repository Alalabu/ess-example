
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreTags = app[modelName].define('store_tags', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tag_name: {
      type: DataTypes.STRING,
    },
    tag_code: {
      type: DataTypes.STRING,
    },
    rank_code: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreTags.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_tags',
    timestamps: false,
  });

  StoreTags.associate = () => {
    StoreTags.hasMany(app[modelName].StoreTagsRelation, { foreignKey: 'tagid', targetKey: 'id', as: 'storeTagsRelations' });
    StoreTags.hasMany(app[modelName].StoreTagsOrder, { foreignKey: 'storetagid', targetKey: 'id', as: 'storeTagsOrders' });
    // StoreTags.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreTags.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreTags;
};

