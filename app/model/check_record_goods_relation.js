
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const CheckRecordGoodsRelation = app[modelName].define('check_record_goods_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    check_id: {
      type: DataTypes.STRING,
    },
    critical_value: {
      type: DataTypes.INTEGER,
    },
    current_num: {
      type: DataTypes.INTEGER,
    },
    replenishment: {
      type: DataTypes.INTEGER,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(CheckRecordGoodsRelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(CheckRecordGoodsRelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'check_record_goods_relation',
    timestamps: false,
  });

  CheckRecordGoodsRelation.associate = () => {
    // CheckRecordGoodsRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // CheckRecordGoodsRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return CheckRecordGoodsRelation;
};

