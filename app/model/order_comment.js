
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const OrderComment = app[modelName].define('order_comment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: { // 商户id
      type: DataTypes.STRING,
    },
    client_id: { // 用户id
      type: DataTypes.STRING,
    },
    out_trade_no: { // 订单id
      type: DataTypes.STRING,
    },
    reply_id: { // 回复id
      type: DataTypes.STRING,
    },
    pic_url: { // 配图
      type: DataTypes.STRING,
    },
    score: { // 评分,1-5
      type: DataTypes.INTEGER,
    },
    content: { // 内容
      type: DataTypes.STRING,
    },
    is_anonymity: { // 是否匿名,0=否,1=是
      type: DataTypes.STRING,
    },
    status: { // 审核状态,0=审核中,1=通过,-1=未通过
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(OrderComment.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'order_comment',
    timestamps: false,
  });

  OrderComment.associate = () => {
    OrderComment.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    OrderComment.belongsTo(app[modelName].XqStore, { foreignKey: 'store_id', targetKey: 'id' });
    OrderComment.belongsTo(app[modelName].Order, { foreignKey: 'out_trade_no', targetKey: 'out_trade_no' });
    // OrderComment.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // OrderComment.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return OrderComment;
};

