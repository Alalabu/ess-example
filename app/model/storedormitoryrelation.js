
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Storedormitoryrelation = app[modelName].define('storedormitoryrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    rule_id: {
      type: DataTypes.STRING,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Storedormitoryrelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'storedormitoryrelation',
    timestamps: false,
  });

  Storedormitoryrelation.associate = () => {
    // Storedormitoryrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Storedormitoryrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Storedormitoryrelation;
};

