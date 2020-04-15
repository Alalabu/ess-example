
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Goodstypesrelation = app[modelName].define('goodstypesrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    goods_id: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Goodstypesrelation.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'goodstypesrelation',
    timestamps: false,
  });

  Goodstypesrelation.associate = () => {
    // Goodstypesrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Goodstypesrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Goodstypesrelation;
};

