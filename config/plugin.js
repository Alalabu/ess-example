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

  senecaSubserver: {
    enable: true,
    package: 'egg-seneca-subserver',
  },
};
