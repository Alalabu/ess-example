
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Applyforpartner = app[modelName].define('applyforpartner', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sysuer_id: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    reject_reason: {
      type: DataTypes.STRING,
    },
    apply_time: {
      type: DataTypes.DATE,
      get apply_time() {
        return moment(Applyforpartner.getDataValue('apply_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    check_time: {
      type: DataTypes.DATE,
      get check_time() {
        return moment(Applyforpartner.getDataValue('check_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'applyforpartner',
    timestamps: false,
  });

  Applyforpartner.associate = () => {
    // Applyforpartner.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Applyforpartner.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Applyforpartner;
};

