
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
    area_id: {
      type: DataTypes.STRING,
    }, 
    tag_name: {
      type: DataTypes.STRING,
    },
    tag_code: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(StoreTags.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'store_tags',
    timestamps: false,
  });

  StoreTags.associate = () => {
    StoreTags.hasMany(app[modelName].XqStore, { foreignKey: 'tag_id', targetKey: 'id' });
    StoreTags.hasMany(app[modelName].StoreTagsOrder, { foreignKey: 'storetag_id', targetKey: 'id' });
    // StoreTags.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // StoreTags.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return StoreTags;
};

