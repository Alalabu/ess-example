
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Order = app[modelName].define('order', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    knight_id: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    short_num: {
      type: DataTypes.STRING,
    },
    out_trade_no: {
      type: DataTypes.STRING,
    },
    device: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    spbill_create_ip: {
      type: DataTypes.STRING,
    },
    gift_fee: {
      type: DataTypes.INTEGER,
    },
    discount_fee: {
      type: DataTypes.INTEGER,
    },
    express_fee: {
      type: DataTypes.INTEGER,
    },
    total_fee: {
      type: DataTypes.INTEGER,
    },
    goods_detail: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
    er_pic: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Order.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    realname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    school_area: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    floor: {
      type: DataTypes.INTEGER,
    },
    is_first: {
      type: DataTypes.INTEGER,
    },
    dorm_no: {
      type: DataTypes.INTEGER,
    },
    rush_activity_id: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'order',
    timestamps: false,
  });

  Order.associate = () => {
    Order.belongsTo(app.model.Address, { foreignKey: 'address', targetKey: 'id', as: 'orderAddress' });
    Order.belongsTo(app[modelName].Ordergoodsrelation, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no', as: 'ordergoodsrelation' });
    // Order.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Order.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Order;
};

