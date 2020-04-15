
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CheckRecord = app[modelName].define('check_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    rule_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    creator_id: {
      type: DataTypes.STRING,
    },
    neatener_id: {
      type: DataTypes.STRING,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    confirm_id: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(CheckRecord.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    neatenAt: {
      type: DataTypes.DATE,
      get neatenAt() {
        return moment(CheckRecord.getDataValue('neatenAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    confirmAt: {
      type: DataTypes.DATE,
      get confirmAt() {
        return moment(CheckRecord.getDataValue('confirmAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    receiveAt: {
      type: DataTypes.DATE,
      get receiveAt() {
        return moment(CheckRecord.getDataValue('receiveAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(CheckRecord.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    user_back_id: {
      type: DataTypes.STRING,
    },
    is_email: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'check_record',
    timestamps: false,
  });

  CheckRecord.associate = () => {
    // CheckRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // CheckRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return CheckRecord;
};

