
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TicketDetailInfos = app[modelName].define('ticket_detail_infos', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    clientid: {
      type: DataTypes.STRING,
    },
    ticketid: {
      type: DataTypes.STRING,
    },
    usestruts: {
      type: DataTypes.INTEGER,
    },
    onsale_value: {
      type: DataTypes.INTEGER,
    },
    acode_url: {
      type: DataTypes.STRING,
    },
    useAt: {
      type: DataTypes.DATE,
      get useAt() {
        return moment(TicketDetailInfos.getDataValue('useAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      // defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(TicketDetailInfos.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ticket_detail_infos',
    timestamps: false,
  });

  TicketDetailInfos.associate = () => {
    TicketDetailInfos.belongsTo(app[modelName].TicketInfos, { foreignKey: 'ticketid', targetKey: 'id', as: 'ticketInfos' });
    TicketDetailInfos.belongsTo(app[modelName].XqClient, { foreignKey: 'clientid', targetKey: 'id', as: 'xqClient' });
    // TicketDetailInfos.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TicketDetailInfos.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TicketDetailInfos;
};

