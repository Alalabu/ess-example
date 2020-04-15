
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Address = app[modelName].define('address', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
    },
    dorm_id: {
      type: DataTypes.STRING,
    },
    floor: {
      type: DataTypes.INTEGER,
    },
    dorm_no: {
      type: DataTypes.INTEGER,
    },
    author_id: {
      type: DataTypes.STRING,
    },
    realname: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.INTEGER,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    school_area: {
      type: DataTypes.STRING,
    },
    detail: {
      type: DataTypes.STRING,
    },
    is_default: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Address.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = () => {
    // Address.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Address.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Address;
};

