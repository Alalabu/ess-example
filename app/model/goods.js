
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Goods = app[modelName].define('goods', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    go_id: {
      type: DataTypes.STRING,
    },
    channel_id: {
      type: DataTypes.STRING,
    },
    thumb_url: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    purchase_price: {
      type: DataTypes.INTEGER,
    },
    good_type: {
      type: DataTypes.INTEGER,
    },
    summary: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    is_limit: {
      type: DataTypes.INTEGER,
    },
    discount_price: {
      type: DataTypes.INTEGER,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Goods.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    total_count: {
      type: DataTypes.INTEGER,
    },
    sell_count: {
      type: DataTypes.INTEGER,
    },
    history_count: {
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Goods.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    someone1: {
      type: DataTypes.INTEGER,
    },
    someone2: {
      type: DataTypes.INTEGER,
    },
    someone3: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'goods',
    timestamps: false,
  });

  Goods.associate = () => {
    // Goods.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goods.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goods;
};

