
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Sellertypesrelation = app[modelName].define('sellertypesrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    type_id: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Sellertypesrelation.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sellertypesrelation',
    timestamps: false,
  });

  Sellertypesrelation.associate = () => {
    // Sellertypesrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Sellertypesrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Sellertypesrelation;
};

