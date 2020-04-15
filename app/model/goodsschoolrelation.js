
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Goodsschoolrelation = app[modelName].define('goodsschoolrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    total_count: {
      type: DataTypes.INTEGER,
    },
    seller_count: {
      type: DataTypes.INTEGER,
    },
    create_time: {
      type: DataTypes.DATE,
      get create_time() {
        return moment(Goodsschoolrelation.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    modify_time: {
      type: DataTypes.DATE,
      get modify_time() {
        return moment(Goodsschoolrelation.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goodsschoolrelation',
    timestamps: false,
  });

  Goodsschoolrelation.associate = () => {
    // Goodsschoolrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goodsschoolrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goodsschoolrelation;
};

