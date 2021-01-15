
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TicketOrder = app[modelName].define('ticket_order', {
    id: { // 订单用券记录id
      type: DataTypes.STRING,
      primaryKey: true,
    },
    out_trade_no: { // 订单id
      type: DataTypes.STRING,
    },
    ticket_id: { // 折扣券id
      type: DataTypes.STRING,
    },
    client_id: { // 客户id
      type: DataTypes.STRING,
    },
    store_id: { // 商家id
      type: DataTypes.STRING,
    },
    issue: { // 发布角色,s=商家,a=区域管理
      type: DataTypes.STRING,
    },
    fee_max: { // 满额,单位分
      type: DataTypes.INTEGER,
    },
    fee_offset: { // 抵消额,单位分
      type: DataTypes.INTEGER,
    },
    total_fee: { // 订单总额
      type: DataTypes.INTEGER,
    },
    goods_fee: { // 商品额
      type: DataTypes.INTEGER,
    },
    create_at: { // 创建时间
      type: DataTypes.DATE,
      get create_at() {
        return moment(TicketOrder.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ticket_order',
    timestamps: false,
  });

  TicketOrder.associate = () => {
    // TicketOrder.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TicketOrder.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TicketOrder;
};

