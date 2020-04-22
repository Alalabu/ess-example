
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TicketInfos = app[modelName].define('ticket_infos', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    activityid: {
      type: DataTypes.STRING,
    },
    publish_userid: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    onsale_class: {
      type: DataTypes.INTEGER,
    },
    // onsale_discount: {
    //   type: DataTypes.INTEGER,
    // },
    // onsale_price: {
    //   type: DataTypes.INTEGER,
    // },
    onsale_quota: { // 满减额度
      type: DataTypes.INTEGER,
    },
    receive_class: {
      type: DataTypes.INTEGER,
    },
    onsale_value: {
      type: DataTypes.INTEGER,
    },
    scope_max: {
      type: DataTypes.INTEGER,
    },
    scope_min: {
      type: DataTypes.INTEGER,
    },
    counts: {
      type: DataTypes.INTEGER,
    },
    start_time: {
      type: DataTypes.DATE,
      get start_time() {
        return moment(TicketInfos.getDataValue('start_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    end_time: {
      type: DataTypes.DATE,
      get end_time() {
        return moment(TicketInfos.getDataValue('end_time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(TicketInfos.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    partNum: { // 虚拟字段, 用于查询时获取当前券总参与人数, 增删改不可用
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'ticket_infos',
    timestamps: false,
  });

  TicketInfos.associate = () => {
    TicketInfos.belongsTo(app[modelName].Activities, { foreignKey: 'activityid', targetKey: 'id', as: 'activity' });
    TicketInfos.belongsTo(app[modelName].XqManager, { foreignKey: 'publish_userid', targetKey: 'id', as: 'xqManager' });
    TicketInfos.belongsTo(app[modelName].TicketDetailInfos, {
      foreignKey: 'id', targetKey: 'ticketid', as: 'ticketDetailInfo' });

    // TicketInfos.hasMany(app[modelName].TicketDetailInfos, {
    //   foreignKey: 'ticketid', targetKey: 'id', as: 'ticketStat' });

    TicketInfos.hasMany(app[modelName].TicketDetailInfos, {
      foreignKey: 'ticketid', targetKey: 'id', as: 'ticketDetailInfos' });
    // TicketInfos.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TicketInfos.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TicketInfos;
};

