
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Noticeforknight = app[modelName].define('noticeforknight', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    partner_id: {
      type: DataTypes.STRING,
    },
    ntype: {
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Noticeforknight.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'noticeforknight',
    timestamps: false,
  });

  Noticeforknight.associate = () => {
    // Noticeforknight.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Noticeforknight.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Noticeforknight;
};

