
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const StoreTagsRelation = app[modelName].define('store_tags_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    tagid: {
      type: DataTypes.STRING,
    },
    storeid: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(StoreTagsRelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_tags_relation',
    timestamps: false,
  });

  StoreTagsRelation.associate = () => {
    StoreTagsRelation.belongsTo(app[modelName].StoreInfos, { foreignKey: 'storeid', targetKey: 'id', as: 'storeInfo' });
    StoreTagsRelation.belongsTo(app[modelName].StoreTags, { foreignKey: 'tagid', targetKey: 'id', as: 'storeTag' });
    // StoreTagsRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreTagsRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreTagsRelation;
};

