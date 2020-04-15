
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsDormitoryRecallRecord = app[modelName].define('goods_dormitory_recall_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    out_trade_no: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    goods_name: {
      type: DataTypes.STRING,
    },
    origin_sell_count: {
      type: DataTypes.INTEGER,
    },
    new_sell_count: {
      type: DataTypes.INTEGER,
    },
    exec_type: {
      type: DataTypes.INTEGER,
    },
    total_count: {
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(GoodsDormitoryRecallRecord.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(GoodsDormitoryRecallRecord.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    dgr_version: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'goods_dormitory_recall_record',
    timestamps: false,
  });

  GoodsDormitoryRecallRecord.associate = () => {
    // GoodsDormitoryRecallRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsDormitoryRecallRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsDormitoryRecallRecord;
};

