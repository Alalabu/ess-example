
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const TicketClient = app[modelName].define('ticket_client', {
    id: { // 
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: { // 客户id
      type: DataTypes.STRING,
    },
    ticket_id: { // 折扣券id
      type: DataTypes.STRING,
    },
    struts: { // 使用状态,0=未使用,1=已使用
      type: DataTypes.STRING,
    },
    used_at: { // 使用时间
      type: DataTypes.DATE,
      get used_at() {
        return moment(TicketClient.getDataValue('used_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    create_at: { // 领取时间
      type: DataTypes.DATE,
      get create_at() {
        return moment(TicketClient.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'ticket_client',
    timestamps: false,
  });

  TicketClient.associate = () => {
    // TicketClient.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // TicketClient.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return TicketClient;
};

