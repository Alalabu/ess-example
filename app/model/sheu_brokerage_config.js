
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const SheuBrokerageConfig = app[modelName].define('sheu_brokerage_config', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    qrcode_url: {
      type: DataTypes.STRING,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(SheuBrokerageConfig.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(SheuBrokerageConfig.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sheu_brokerage_config',
    timestamps: false,
  });

  SheuBrokerageConfig.associate = () => {
    // SheuBrokerageConfig.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // SheuBrokerageConfig.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return SheuBrokerageConfig;
};

