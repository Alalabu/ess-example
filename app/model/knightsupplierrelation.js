
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Knightsupplierrelation = app[modelName].define('knightsupplierrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    knight_id: {
      type: DataTypes.STRING,
    },
    supplier_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Knightsupplierrelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Knightsupplierrelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'knightsupplierrelation',
    timestamps: false,
  });

  Knightsupplierrelation.associate = () => {
    // Knightsupplierrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Knightsupplierrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Knightsupplierrelation;
};

