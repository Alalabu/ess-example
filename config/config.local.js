// 'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  console.log('准备读取并合并 config.local.js');

  return {
    ...config,
  };
};
