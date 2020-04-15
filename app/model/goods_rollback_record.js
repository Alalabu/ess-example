
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsRollbackRecord = app[modelName].define('goods_rollback_record', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    supplier_name: {
      type: DataTypes.STRING,
    },
    supplier_phone: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    school_title: {
      type: DataTypes.STRING,
    },
    operator_id: {
      type: DataTypes.STRING,
    },
    operator_name: {
      type: DataTypes.STRING,
    },
    operator_phone: {
      type: DataTypes.STRING,
    },
    scene_code: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(GoodsRollbackRecord.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_rollback_record',
    timestamps: false,
  });

  GoodsRollbackRecord.associate = () => {
    // GoodsRollbackRecord.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsRollbackRecord.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsRollbackRecord;
};

