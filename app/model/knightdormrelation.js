
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Knightdormrelation = app[modelName].define('knightdormrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    knight_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    business_state: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Knightdormrelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Knightdormrelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'knightdormrelation',
    timestamps: false,
  });

  Knightdormrelation.associate = () => {
    // Knightdormrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Knightdormrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Knightdormrelation;
};

