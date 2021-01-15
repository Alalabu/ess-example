
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Order = app[modelName].define('order', {
    out_trade_no: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    short_no: {
      type: DataTypes.STRING,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    store_id: {
      type: DataTypes.STRING,
    },
    store_name: {
      type: DataTypes.STRING,
    },
    knight_id: {
      type: DataTypes.STRING,
    },
    address_id: {
      type: DataTypes.STRING,
    },
    client_name: {
      type: DataTypes.STRING,
    },
    client_gender: {
      type: DataTypes.STRING,
    },
    client_mobile: {
      type: DataTypes.STRING,
    },
    client_area_scope: {
      type: DataTypes.STRING,
    },
    client_address_detail: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    tablesign_id: {
      type: DataTypes.STRING,
    },
    out_refund_no: {
      type: DataTypes.STRING,
    },
    refund_struts: {
      type: DataTypes.STRING,
    },
    refund_fee: {
      type: DataTypes.INTEGER,
    },
    refund_desc: {
      type: DataTypes.STRING,
    },
    refund_at: {
      type: DataTypes.DATE,
      get refund_at() {
        return moment(Order.getDataValue('refund_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    orderstruts: {
      type: DataTypes.STRING,
    },
    historystruts: {
      type: DataTypes.STRING,
    },
    total_fee: {
      type: DataTypes.INTEGER,
    },
    origin_fee: {
      type: DataTypes.INTEGER,
    },
    delivery_fee: {
      type: DataTypes.INTEGER,
    },
    meal_fee: {
      type: DataTypes.INTEGER,
    },
    appointment: {
      type: DataTypes.DATE,
      get appointment() {
        return moment(Order.getDataValue('appointment')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    tags: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
    use_pattern: {
      type: DataTypes.STRING,
    },
    receivable_way: { // 商圈下商铺回款方式,merchant=统一微信商户,store=直接回款至商家
      type: DataTypes.STRING,
    },
    prepay_at: {
      type: DataTypes.DATE,
      get prepay_at() {
        return moment(Order.getDataValue('prepay_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    payed_at: {
      type: DataTypes.DATE,
      get payed_at() {
        return moment(Order.getDataValue('payed_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    payfail_at: {
      type: DataTypes.DATE,
      get payfail_at() {
        return moment(Order.getDataValue('payfail_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    payfail_reason: {
      type: DataTypes.STRING,
    },
    order_close_at: {
      type: DataTypes.DATE,
      get order_close_at() {
        return moment(Order.getDataValue('order_close_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    knight_take_at: {
      type: DataTypes.DATE,
      get knight_take_at() {
        return moment(Order.getDataValue('knight_take_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    seller_done_at: {
      type: DataTypes.DATE,
      get seller_done_at() {
        return moment(Order.getDataValue('seller_done_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    seller_excep_at: {
      type: DataTypes.DATE,
      get seller_excep_at() {
        return moment(Order.getDataValue('seller_excep_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    knight_acqu_at: {
      type: DataTypes.DATE,
      get knight_acqu_at() {
        return moment(Order.getDataValue('knight_acqu_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    knight_fail_at: {
      type: DataTypes.DATE,
      get knight_fail_at() {
        return moment(Order.getDataValue('knight_fail_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    knight_fail_reason: {
      type: DataTypes.STRING,
    },
    knight_fail_paid: {
      type: DataTypes.INTEGER,
    },
    order_done_at: {
      type: DataTypes.DATE,
      get order_done_at() {
        return moment(Order.getDataValue('order_done_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    is_comment: { // 是否已评论, 0=否, 1=是
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(Order.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    update_at: {
      type: DataTypes.DATE,
      get update_at() {
        return moment(Order.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    tableName: 'order',
    timestamps: false,
  });

  Order.associate = () => {
    Order.hasMany(app[modelName].OrderGoodsRelation, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });

    Order.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    Order.belongsTo(app[modelName].XqKnight, { foreignKey: 'knight_id', targetKey: 'id' });
    Order.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    Order.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    Order.belongsTo(app[modelName].Address, { foreignKey: 'address_id', targetKey: 'id' });
    Order.belongsTo(app[modelName].OrderComment, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });
    // Order.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Order.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Order;
};

