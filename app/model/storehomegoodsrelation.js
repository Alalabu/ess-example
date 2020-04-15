
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Storehomegoodsrelation = app[modelName].define('storehomegoodsrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    current_num: {
      type: DataTypes.INTEGER,
    },
    history_num: {
      type: DataTypes.INTEGER,
    },
    in_num: {
      type: DataTypes.INTEGER,
    },
    out_num: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      get createdAt() {
        return moment(Storehomegoodsrelation.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Storehomegoodsrelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'storehomegoodsrelation',
    timestamps: false,
  });

  Storehomegoodsrelation.associate = () => {
    // Storehomegoodsrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Storehomegoodsrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Storehomegoodsrelation;
};

