
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Fullreduction = app[modelName].define('fullreduction', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    summary: {
      type: DataTypes.STRING,
    },
    full_fee: {
      type: DataTypes.INTEGER,
    },
    discount_fee: {
      type: DataTypes.INTEGER,
    },
    state: {
      type: DataTypes.INTEGER,
    },
    remark: {
      type: DataTypes.STRING,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Fullreduction.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Fullreduction.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'fullreduction',
    timestamps: false,
  });

  Fullreduction.associate = () => {
    // Fullreduction.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Fullreduction.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Fullreduction;
};

