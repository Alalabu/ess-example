
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Goodsauxiliaryrelation = app[modelName].define('goodsauxiliaryrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    major_goods_id: {
      type: DataTypes.STRING,
    },
    auxiliary_id: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    level: {
      type: DataTypes.INTEGER,
    },
    is_enable: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Goodsauxiliaryrelation.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updated: {
      type: DataTypes.DATE,
      get updated() {
        return moment(Goodsauxiliaryrelation.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goodsauxiliaryrelation',
    timestamps: false,
  });

  Goodsauxiliaryrelation.associate = () => {
    // Goodsauxiliaryrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goodsauxiliaryrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goodsauxiliaryrelation;
};

