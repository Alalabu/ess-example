
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Goodssupplierrelation = app[modelName].define('goodssupplierrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    current_count: {
      type: DataTypes.INTEGER,
    },
    seller_count: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    alarm_value: {
      type: DataTypes.INTEGER,
    },
    modify_time: {
      type: DataTypes.DATE,
      get modify_time() {
        return moment(Goodssupplierrelation.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    create_time: {
      type: DataTypes.DATE,
      get create_time() {
        return moment(Goodssupplierrelation.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goodssupplierrelation',
    timestamps: false,
  });

  Goodssupplierrelation.associate = () => {
    // Goodssupplierrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goodssupplierrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goodssupplierrelation;
};

