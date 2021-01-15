
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const XqClientNst = app[modelName].define('xq_client_nst', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.STRING,
    },
    category_id: { // 消耗类别ID
      type: DataTypes.STRING,
    },
    recom_id: { // 推荐标准类别ID
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    age: { // 年龄
      type: DataTypes.INTEGER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    stature: { // 身高 (厘米)
      type: DataTypes.INTEGER,
    },
    weight: { // 体重 (斤)
      type: DataTypes.INTEGER,
    },
    is_default: {
      type: DataTypes.STRING,
    },
    rl: {
      type: DataTypes.FLOAT,
    },
    zf: {
      type: DataTypes.FLOAT,
    },
    dbz: {
      type: DataTypes.FLOAT,
    },
    shhf: {
      type: DataTypes.FLOAT,
    },
    ssxw: {
      type: DataTypes.FLOAT,
    },
    wssa: {
      type: DataTypes.FLOAT,
    },
    las: {
      type: DataTypes.FLOAT,
    },
    su: {
      type: DataTypes.FLOAT,
    },
    ys: {
      type: DataTypes.FLOAT,
    },
    wsfc: {
      type: DataTypes.FLOAT,
    },
    wsse: {
      type: DataTypes.FLOAT,
    },
    shc: {
      type: DataTypes.FLOAT,
    },
    lb: {
      type: DataTypes.FLOAT,
    },
    dgc: {
      type: DataTypes.FLOAT,
    },
    gai: {
      type: DataTypes.FLOAT,
    },
    mei: {
      type: DataTypes.FLOAT,
    },
    tei: {
      type: DataTypes.FLOAT,
    },
    meng: {
      type: DataTypes.FLOAT,
    },
    xin: {
      type: DataTypes.FLOAT,
    },
    tong: {
      type: DataTypes.FLOAT,
    },
    jia: {
      type: DataTypes.FLOAT,
    },
    ling: {
      type: DataTypes.FLOAT,
    },
    la: {
      type: DataTypes.FLOAT,
    },
    xi: {
      type: DataTypes.FLOAT,
    },
    create_at: {
      type: DataTypes.DATE,
      get create_at() {
        return moment(XqClientNst.getDataValue('create_at')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'xq_client_nst',
    timestamps: false,
  });

  XqClientNst.associate = () => {
    XqClientNst.belongsTo(app[modelName].XqClient, { foreignKey: 'client_id', targetKey: 'id' });
    XqClientNst.belongsTo(app[modelName].FoodConsumeCategory, { foreignKey: 'category_id', targetKey: 'id' });
    XqClientNst.belongsTo(app[modelName].FoodConsumeRecom, { foreignKey: 'recom_id', targetKey: 'id' });
    
    // XqClientNst.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // XqClientNst.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return XqClientNst;
};

