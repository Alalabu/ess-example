
'use strict';
const moment = require('moment');
const format = require('date-format');
const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqStore = app[modelName].define('xq_store', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    unionid: {
      type: DataTypes.STRING,
    },
    openid: {
      type: DataTypes.STRING,
    },
    dining_id: { // 所属餐厅
      type: DataTypes.STRING,
    },
    logourl: {
      type: DataTypes.STRING,
    },
    bgimgurl: {
      type: DataTypes.STRING,
    },
    qcodeurl: {
      type: DataTypes.STRING,
    },
    tag_id: {
      type: DataTypes.STRING,
    },
    store_name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    seller_name: {
      type: DataTypes.STRING,
    },
    seller_phone: {
      type: DataTypes.STRING,
    },
    cost_password: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    biz_struts: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    printer_no: {
      type: DataTypes.STRING,
    },
    can_delivery: {
      type: DataTypes.STRING,
    },
    can_takeself: {
      type: DataTypes.STRING,
    },
    can_eatin: {
      type: DataTypes.STRING,
    },
    delivery_state: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    can_tablesign: {
      type: DataTypes.STRING,
    },
    can_change_struts: {
      type: DataTypes.STRING,
    },
    can_set_delivery_fee: {
      type: DataTypes.STRING,
    },
    delivery_fee: {
      type: DataTypes.INTEGER,
    },
    can_set_meal_fee: {
      type: DataTypes.STRING,
    },
    meal_fee: {
      type: DataTypes.INTEGER,
    },
    auto_takeorder: { // 自动接单, 默认 0=禁用, 1=启用
      type: DataTypes.STRING,
    },
    start_time: {
      type: DataTypes.STRING,
      get start_time() {
        const now = new Date(`2020-06-01 ${XqStore.getDataValue('start_time')}`);
        return format('hh:mm', now);
      },
      // defaultValue: '06:00',
    },
    stop_time: {
      type: DataTypes.STRING,
      get stop_time() {
        const now = new Date(`2020-06-01 ${XqStore.getDataValue('stop_time')}`);
        return format('hh:mm', now);
      },
      // defaultValue: '21:00',
    },
    can_withdrawal: { // 是否可提款, 默认 0=禁用, 1=启用
      type: DataTypes.STRING,
    },
    history_income: { // 历史入账
      type: DataTypes.INTEGER,
    },
    withdrawal_ratio: { // 提款比例(1-100)%, 剩余部分为微信支付商户入账
      type: DataTypes.INTEGER,
    },
    withdrawal_fee: { // 可提款额度
      type: DataTypes.INTEGER,
    },
    withdrawaled: { // 已提款额度
      type: DataTypes.INTEGER,
    },
    latest_withdrawal_at: { // 最后提款时间
      type: DataTypes.DATE,
      get latest_withdrawal_at() {
        return moment(XqStore.getDataValue('latest_withdrawal_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    total_score: { // 总评分,10-50分,0分不显示, 前台/10 并取小数点后一位
      type: DataTypes.INTEGER,
    },
    comment_count: { // 评论数量
      type: DataTypes.INTEGER,
    },
    zeronorm: { // 最低消费限额
      type: DataTypes.INTEGER,
    },
    update_at: {
      type: DataTypes.DATE,
      get update_at() {
        return moment(XqStore.getDataValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqStore.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_store',
    timestamps: false,
  });

  XqStore.associate = () => {
    XqStore.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    XqStore.belongsTo(app[modelName].StoreTags, { foreignKey: 'tag_id', targetKey: 'id' });
    XqStore.belongsTo(app[modelName].StoreDining, { foreignKey: 'dining_id', targetKey: 'id' });

    XqStore.hasMany(app[modelName].XqSubSeller, { foreignKey: 'store_id', targetKey: 'id' });
    XqStore.hasMany(app[modelName].GoodsChannel, { foreignKey: 'store_id', targetKey: 'id' });
    XqStore.hasMany(app[modelName].Goods, { foreignKey: 'store_id', targetKey: 'id' });
    XqStore.hasMany(app[modelName].OrderComment, { foreignKey: 'store_id', targetKey: 'id' });
    XqStore.hasMany(app[modelName].TicketInfo, { foreignKey: 'store_id', targetKey: 'id' });
    // XqStore.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqStore.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqStore;
};

