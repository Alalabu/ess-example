
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Schoolsettings = app[modelName].define('schoolsettings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    express_fee: {
      type: DataTypes.INTEGER,
    },
    rush_express_fee: {
      type: DataTypes.INTEGER,
    },
    breakfast_express_fee: {
      type: DataTypes.INTEGER,
    },
    fruits_express_fee: {
      type: DataTypes.INTEGER,
    },
    lunch_express_fee: {
      type: DataTypes.INTEGER,
    },
    supper_express_fee: {
      type: DataTypes.INTEGER,
    },
    night_express_fee: {
      type: DataTypes.INTEGER,
    },
    remark: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    rush_no_shipping: {
      type: DataTypes.INTEGER,
    },
    subscribe_no_shipping: {
      type: DataTypes.INTEGER,
    },
    breakfast_no_shipping: {
      type: DataTypes.INTEGER,
    },
    fruits_no_shipping: {
      type: DataTypes.INTEGER,
    },
    lunch_no_shipping: {
      type: DataTypes.INTEGER,
    },
    supper_no_shipping: {
      type: DataTypes.INTEGER,
    },
    night_no_shipping: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Schoolsettings.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Schoolsettings.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'schoolsettings',
    timestamps: false,
  });

  Schoolsettings.associate = () => {
    // Schoolsettings.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Schoolsettings.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Schoolsettings;
};

