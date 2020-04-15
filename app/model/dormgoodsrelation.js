
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Dormgoodsrelation = app[modelName].define('dormgoodsrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    total_count: {
      type: DataTypes.INTEGER,
    },
    seller_count: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    create_time: {
      type: DataTypes.DATE,
      get create_time() {
        return moment(Dormgoodsrelation.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    modify_time: {
      type: DataTypes.DATE,
      get modify_time() {
        return moment(Dormgoodsrelation.getDataValue('modify_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    version_num: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'dormgoodsrelation',
    timestamps: false,
  });

  Dormgoodsrelation.associate = () => {
    // Dormgoodsrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Dormgoodsrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Dormgoodsrelation;
};

