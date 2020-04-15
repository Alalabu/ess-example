
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Switchshoplog = app[modelName].define('switchshoplog', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    operation: {
      type: DataTypes.STRING,
    },
    oper_type: {
      type: DataTypes.INTEGER,
    },
    summary: {
      type: DataTypes.STRING,
    },
    remark: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Switchshoplog.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'switchshoplog',
    timestamps: false,
  });

  Switchshoplog.associate = () => {
    // Switchshoplog.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Switchshoplog.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Switchshoplog;
};

