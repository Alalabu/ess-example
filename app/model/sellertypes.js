
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Sellertypes = app[modelName].define('sellertypes', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    ctype: {
      type: DataTypes.STRING,
    },
    clevel: {
      type: DataTypes.INTEGER,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Sellertypes.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sellertypes',
    timestamps: false,
  });

  Sellertypes.associate = () => {
    // Sellertypes.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Sellertypes.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Sellertypes;
};

