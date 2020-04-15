
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Products = app[modelName].define('products', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    img_url: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    channel_id: {
      type: DataTypes.STRING,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    is_limit: {
      type: DataTypes.INTEGER,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    discount_price: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Products.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Products.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'products',
    timestamps: false,
  });

  Products.associate = () => {
    // Products.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Products.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Products;
};

