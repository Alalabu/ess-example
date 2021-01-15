
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Banners = app[modelName].define('banners', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    master_id: {
      type: DataTypes.STRING,
    },
    picurl: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(Banners.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'banners',
    timestamps: false,
  });

  Banners.associate = () => {
    // Banners.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Banners.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Banners;
};

