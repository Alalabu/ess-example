
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Food = app[modelName].define('food', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    detail_url: {
      type: DataTypes.STRING,
    },
    index: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(Food.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    rl: {
      type: DataTypes.FLOAT,
    },
    las: {
      type: DataTypes.FLOAT,
    },
    gai: {
      type: DataTypes.FLOAT,
    },
    dbz: {
      type: DataTypes.FLOAT,
    },
    su: {
      type: DataTypes.FLOAT,
    },
    mei: {
      type: DataTypes.FLOAT,
    },
    zf: {
      type: DataTypes.FLOAT,
    },
    ys: {
      type: DataTypes.FLOAT,
    },
    tei: {
      type: DataTypes.FLOAT,
    },
    shhf: {
      type: DataTypes.FLOAT,
    },
    wsfc: {
      type: DataTypes.FLOAT,
    },
    meng: {
      type: DataTypes.FLOAT,
    },
    ssxw: {
      type: DataTypes.FLOAT,
    },
    wsse: {
      type: DataTypes.FLOAT,
    },
    xin: {
      type: DataTypes.FLOAT,
    },
    wssa: {
      type: DataTypes.FLOAT,
    },
    dgc: {
      type: DataTypes.FLOAT,
    },
    tong: {
      type: DataTypes.FLOAT,
    },
    lb: {
      type: DataTypes.FLOAT,
    },
    jia: {
      type: DataTypes.FLOAT,
    },
    ling: {
      type: DataTypes.FLOAT,
    },
    shc: {
      type: DataTypes.FLOAT,
    },
    la: {
      type: DataTypes.FLOAT,
    },
    xi: {
      type: DataTypes.FLOAT,
    },
    type: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'food',
    timestamps: false,
  });

  Food.associate = () => {
    // Food.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Food.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Food;
};

