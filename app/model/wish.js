
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Wish = app[modelName].define('wish', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    goods_title: {
      type: DataTypes.STRING,
    },
    goods_company: {
      type: DataTypes.STRING,
    },
    goods_logo: {
      type: DataTypes.STRING,
    },
    goods_taste: {
      type: DataTypes.STRING,
    },
    goods_price: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    is_finish: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Wish.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Wish.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'wish',
    timestamps: false,
  });

  Wish.associate = () => {
    // Wish.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Wish.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Wish;
};

