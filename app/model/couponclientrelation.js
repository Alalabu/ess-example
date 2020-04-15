
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Couponclientrelation = app[modelName].define('couponclientrelation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    coupon_id: {
      type: DataTypes.STRING,
    },
    is_use: {
      type: DataTypes.INTEGER,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    order_id: {
      type: DataTypes.STRING,
    },
    use_message: {
      type: DataTypes.STRING,
    },
    deadline: {
      type: DataTypes.DATE,
      get deadline() {
        return moment(Couponclientrelation.getDataValue('deadline')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    use_time: {
      type: DataTypes.DATE,
      get use_time() {
        return moment(Couponclientrelation.getDataValue('use_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    createAt: {
      type: DataTypes.DATE,
      get createAt() {
        return moment(Couponclientrelation.getDataValue('createAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
    updateAt: {
      type: DataTypes.DATE,
      get updateAt() {
        return moment(Couponclientrelation.getDataValue('updateAt')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'couponclientrelation',
    timestamps: false,
  });

  Couponclientrelation.associate = () => {
    // Couponclientrelation.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Couponclientrelation.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Couponclientrelation;
};

