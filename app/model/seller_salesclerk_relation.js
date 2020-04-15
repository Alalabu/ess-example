
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SellerSalesclerkRelation = app[modelName].define('seller_salesclerk_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.STRING,
    },
    unionid: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    realname: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SellerSalesclerkRelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'seller_salesclerk_relation',
    timestamps: false,
  });

  SellerSalesclerkRelation.associate = () => {
    // SellerSalesclerkRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SellerSalesclerkRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SellerSalesclerkRelation;
};

