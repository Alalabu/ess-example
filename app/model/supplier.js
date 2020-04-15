
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Supplier = app[modelName].define('supplier', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    unionid: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.STRING,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    realname: {
      type: DataTypes.STRING,
    },
    phone_num: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    sex: {
      type: DataTypes.INTEGER,
    },
    logo_url: {
      type: DataTypes.STRING,
    },
    notice: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
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
    school_id: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Supplier.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    address: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'supplier',
    timestamps: false,
  });

  Supplier.associate = () => {
    // Supplier.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Supplier.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Supplier;
};

