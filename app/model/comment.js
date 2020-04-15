
'use strict';
const moment = require('moment');

const path = require('path');
const dirSep = __dirname.split(path.sep);
const modelName = dirSep[dirSep.length - 1];

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Comment = app[modelName].define('comment', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    seller_id: {
      type: DataTypes.STRING,
    },
    author_id: {
      type: DataTypes.STRING,
    },
    order_id: {
      type: DataTypes.STRING,
    },
    anonymity: {
      type: DataTypes.INTEGER,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
    },
    struts: {
      type: DataTypes.INTEGER,
    },
    created: {
      type: DataTypes.DATE,
      get created() {
        return moment(Comment.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'comment',
    timestamps: false,
  });

  Comment.associate = () => {
    // Comment.belongsTo(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
    // Comment.hasMany(app[modelName].OtherModel, { foreignKey: 'foreignKey_id', targetKey: 'id' });
  };

  return Comment;
};

