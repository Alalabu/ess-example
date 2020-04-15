
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsRollbackRecordDetail = app[modelName].define('goods_rollback_record_detail', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    grr_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    goods_title: {
      type: DataTypes.STRING,
    },
    dorm_total: {
      type: DataTypes.INTEGER,
    },
    dorm_seller: {
      type: DataTypes.INTEGER,
    },
    supplier_total: {
      type: DataTypes.INTEGER,
    },
    supplier_seller: {
      type: DataTypes.INTEGER,
    },
    surplus_count: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(GoodsRollbackRecordDetail.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_rollback_record_detail',
    timestamps: false,
  });

  GoodsRollbackRecordDetail.associate = () => {
    // GoodsRollbackRecordDetail.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsRollbackRecordDetail.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsRollbackRecordDetail;
};

