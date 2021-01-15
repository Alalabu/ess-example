
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TicketInfo = app[modelName].define('ticket_info', {
    id: { // 
      type: DataTypes.STRING,
      primaryKey: true,
    },
    store_id: { // 商户id
      type: DataTypes.STRING,
    },
    area_id: { // 商圈id
      type: DataTypes.STRING,
    },
    issue: { // 发布角色,s=商家,a=区域管理
      type: DataTypes.STRING,
    },
    category: { // 券类别:m=满减券
      type: DataTypes.STRING,
    },
    title: { // 折扣券名称
      type: DataTypes.STRING,
    },
    desc: { // 折扣券描述
      type: DataTypes.STRING,
    },
    period_begin: { // 有效期,开始时间
      type: DataTypes.DATE,
      get period_begin() {
        return moment(TicketInfo.getDataValue('period_begin')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    period_end: { // 有效期,结束时间
      type: DataTypes.DATE,
      get period_end() {
        return moment(TicketInfo.getDataValue('period_end')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    fee_max: { // 满额,单位分
      type: DataTypes.INTEGER,
    },
    fee_offset: { // 抵消额,单位分
      type: DataTypes.INTEGER,
    },
    count_max: { // 发券数量
      type: DataTypes.INTEGER,
    },
    count_pull: { // 领券数量
      type: DataTypes.INTEGER,
    },
    struts: { // 显示状态,0=隐藏(删除),1=显示
      type: DataTypes.STRING,
    },
    create_at: { // 创建时间
      type: DataTypes.DATE,
      get create_at() {
        return moment(TicketInfo.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ticket_info',
    timestamps: false,
  });

  TicketInfo.associate = () => {
    // TicketInfo.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TicketInfo.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TicketInfo;
};

