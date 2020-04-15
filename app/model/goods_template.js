
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const GoodsTemplate = app[modelName].define('goods_template', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    thumb_url: {
      type: DataTypes.STRING,
    },
    is_limit: {
      type: DataTypes.INTEGER,
    },
    summary: {
      type: DataTypes.STRING,
    },
    cost_price: {
      type: DataTypes.INTEGER,
    },
    purchase_price: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(GoodsTemplate.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods_template',
    timestamps: false,
  });

  GoodsTemplate.associate = () => {
    // GoodsTemplate.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // GoodsTemplate.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return GoodsTemplate;
};

