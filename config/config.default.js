/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1582444646911_379';

  // add your middleware config here
  config.middleware = [ 'auth' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // config for cors
  config.cors = {
    origin: '*',
    allowHeaders: [ 'x-csrf-token' ],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.jwt = {
    secret: 'bcrypt',
    expiresIn: 7 * 24 * 60 * 60, // 一周过期
  };

  // 鉴权配置
  config.auth = {
    allowed: [// 排除的接口
      '/user/register',
      '/user/login',
    ],
  };

  /**
   * 配置服务器启动项
   */
  config.cluster = {
    listen: {
      port: 20980,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    },
  };

  config.logger = {
    // outputJSON: true,
    dir: '../logs/egg-seneca-server',
  };

  /**
   * egg-seneca-slot 配置
   */
  config.senecaSubserver = {
    appid: 'Alalabu',
    appsecret: '002f61118a6045d1ae7c49173805b0cd',
    server: {
      name: 'users',
      port: 39091,
      title: '用户服务',
      describe: '这个服务用于作为 子服务1 进行测试...',
    },
    gateway: {
      host: '127.0.0.1',
      port: 50005,
      type: 'tcp',
      version: 2.001,
    },
  };

  const gongfu_kuaisong = {
    host: '39.104.190.35',
    port: 53306,
    database: 'luv_db_2',
    username: 'baihaiou9',
    password: 'sHeuN.DaTAbasE201.810',
  };

  config.sequelize = {
    dialect: 'mysql',
    ...gongfu_kuaisong,
    timezone: '+08:00',
    pool: {
      max: 50,
      min: 5,
      idle: 10000,
      acquire: 20000,
      evict: 30000,
    },
    dialectOptions: {
      multipleStatements: true,
    },
    define: {
      underscored: false, // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
      // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
      // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
      // freezeTableName: true,
    },
    retry: { max: 3 },
    logging(sql) {
      // 数据库语句执行打印日志
      console.log('【SQL】 => ', sql);
    },
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
