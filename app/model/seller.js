
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Seller = app[modelName].define('seller', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    business_id: {
      type: DataTypes.STRING,
    },
    seller_admin_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    notice: {
      type: DataTypes.STRING,
    },
    business_status: {
      type: DataTypes.INTEGER,
    },
    business_start: {
      type: DataTypes.STRING,
    },
    business_end: {
      type: DataTypes.STRING,
    },
    express_fee: {
      type: DataTypes.INTEGER,
    },
    min_amount: {
      type: DataTypes.INTEGER,
    },
    seller_fee: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Seller.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'seller',
    timestamps: false,
  });

  Seller.associate = () => {
    // Seller.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Seller.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Seller;
};

