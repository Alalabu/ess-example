
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Adrelation = app[modelName].define('adrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    img_url: {
      type: DataTypes.STRING,
    },
    aduser_id: {
      type: DataTypes.STRING,
    },
    location_state: {
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
        return moment(Adrelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Adrelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'adrelation',
    timestamps: false,
  });

  Adrelation.associate = () => {
    // Adrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Adrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Adrelation;
};

