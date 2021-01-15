
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
    store_id: {
      type: DataTypes.STRING,
    },
    channel_id: {
      type: DataTypes.STRING,
    },
    group_id: {
      type: DataTypes.STRING,
    },
    goods_pic: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    good_type: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    discount_price: {
      type: DataTypes.INTEGER,
    },
    glimit: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    day_amount: { // 日销售数量
      type: DataTypes.INTEGER,
    },
    stock_count: { // 库存数量
      type: DataTypes.INTEGER,
    },
    auto_fill_stock: { // 是否自动每日补库存,1=是,0=否
      type: DataTypes.STRING,
    },
    hot: { // 热门,1=热,0=不热
      type: DataTypes.STRING,
    },
    meal_fee: { // 单件商品餐盒费
      type: DataTypes.INTEGER,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    detail: {
      type: DataTypes.STRING,
    },
    food_count: {
      type: DataTypes.INTEGER,
    },
    rl: {
      type: DataTypes.FLOAT,
    },
    zf: {
      type: DataTypes.FLOAT,
    },
    dbz: {
      type: DataTypes.FLOAT,
    },
    shhf: {
      type: DataTypes.FLOAT,
    },
    ssxw: {
      type: DataTypes.FLOAT,
    },
    wssa: {
      type: DataTypes.FLOAT,
    },
    las: {
      type: DataTypes.FLOAT,
    },
    su: {
      type: DataTypes.FLOAT,
    },
    ys: {
      type: DataTypes.FLOAT,
    },
    wsfc: {
      type: DataTypes.FLOAT,
    },
    wsse: {
      type: DataTypes.FLOAT,
    },
    shc: {
      type: DataTypes.FLOAT,
    },
    lb: {
      type: DataTypes.FLOAT,
    },
    dgc: {
      type: DataTypes.FLOAT,
    },
    gai: {
      type: DataTypes.FLOAT,
    },
    mei: {
      type: DataTypes.FLOAT,
    },
    tei: {
      type: DataTypes.FLOAT,
    },
    meng: {
      type: DataTypes.FLOAT,
    },
    xin: {
      type: DataTypes.FLOAT,
    },
    tong: {
      type: DataTypes.FLOAT,
    },
    jia: {
      type: DataTypes.FLOAT,
    },
    ling: {
      type: DataTypes.FLOAT,
    },
    la: {
      type: DataTypes.FLOAT,
    },
    xi: {
      type: DataTypes.FLOAT,
    },
    update_at: {
      type: DataTypes.DATE,
      get update_at() {
        return moment(Goods.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(Goods.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goods',
    timestamps: false,
  });

  Goods.associate = () => {
    Goods.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    Goods.belongsTo(app[modelName].GoodsChannel, { foreignKey: 'channel_id', targetKey: 'id' });
    Goods.belongsTo(app[modelName].GoodsType, { foreignKey: 'good_type', targetKey: 'id' });
    Goods.belongsTo(app[modelName].GoodsGroup, { foreignKey: 'group_id', targetKey: 'id' });
    
    Goods.hasMany(app[modelName].GoodsFoodRel, { foreignKey: 'goods_id', targetKey: 'id' });
    Goods.hasMany(app[modelName].GoodsSpec, { foreignKey: 'goods_id', targetKey: 'id' });
    // Goods.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goods.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goods;
};

