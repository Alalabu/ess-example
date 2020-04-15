
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Dormsettings = app[modelName].define('dormsettings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    breakfast_state: {
      type: DataTypes.INTEGER,
    },
    rush_state: {
      type: DataTypes.INTEGER,
    },
    fruit_state: {
      type: DataTypes.INTEGER,
    },
    lunch_state: {
      type: DataTypes.INTEGER,
    },
    supper_state: {
      type: DataTypes.INTEGER,
    },
    night_state: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Dormsettings.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Dormsettings.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'dormsettings',
    timestamps: false,
  });

  Dormsettings.associate = () => {
    // Dormsettings.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Dormsettings.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Dormsettings;
};

