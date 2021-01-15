'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 启用插件: cors
  cors: {
    enable: true,
    package: 'egg-cors',
  },

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  // 配置 amqplib
  amqplib: {
    enable: true,
    package: 'egg-amqplib',
  },

};
