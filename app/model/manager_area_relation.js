
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const ManagerAreaRelation = app[modelName].define('manager_area_relation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    manager_id: {
      type: DataTypes.STRING,
    },
    area_id: {
      type: DataTypes.STRING,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(ManagerAreaRelation.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'manager_area_relation',
    timestamps: false,
  });

  ManagerAreaRelation.associate = () => {
    ManagerAreaRelation.belongsTo(app[modelName].StoreArea, { foreignKey: 'area_id', targetKey: 'id' });
    ManagerAreaRelation.belongsTo(app[modelName].XqManager, { foreignKey: 'manager_id', targetKey: 'id' });
    // ManagerAreaRelation.hasMany(app[modelName].XqManager, { foreignKey: 'manager_id', targetKey: 'id' });
    // ManagerAreaRelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // ManagerAreaRelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return ManagerAreaRelation;
};

