
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Supplierinoutgoods = app[modelName].define('supplierinoutgoods', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    partner_id: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    origin_count: {
      type: DataTypes.INTEGER,
    },
    replen_count: {
      type: DataTypes.INTEGER,
    },
    total_count: {
      type: DataTypes.INTEGER,
    },
    remark: {
      type: DataTypes.STRING,
    },
    create_time: {
      type: DataTypes.DATE,
      get create_time() {
        return moment(Supplierinoutgoods.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'supplierinoutgoods',
    timestamps: false,
  });

  Supplierinoutgoods.associate = () => {
    // Supplierinoutgoods.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Supplierinoutgoods.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Supplierinoutgoods;
};

