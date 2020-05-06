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

  // jsonwebtoken 常量配置
  config.jwt = {
    secret: 'bcrypt',
    expiresIn: 7 * 24 * 60 * 60, // 一周过期
  };

  // 鉴权配置
  config.auth = {
    allowed: [// 排除的接口
      '/province/findAll',
      '/city/findAll',
      '/district/findAll',
      '/clientLogin',
    ],
  };

  /**
   * 配置服务器启动项
   */
  config.cluster = {
    listen: {
      port: 50810,
    },
  };

  /**
   * 日志配置
   */
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
      port: 50812,
      title: '通用工具',
      describe: '提供通用接口调用, 如城市、短信、图片操作等',
    },
    gateway: {
      host: '127.0.0.1',
      port: 50805,
      type: 'tcp',
      version: 1.2,
    },
    devLog: true,
  };

  // const gongfu_kuaisong = {
  //   host: '39.104.190.35',
  //   port: 53306,
  //   database: 'luv_db_2',
  //   username: 'baihaiou9',
  //   password: 'sHeuN.DaTAbasE201.810',
  // };

  const SheuShiJiServer = {
    gongfu: {
      host: '39.104.190.35',
      port: 53306,
      database: 'luv_ticket',
      username: 'baihaiou9',
      password: 'sHeuN.DaTAbasE201.810',
    },
    local: {
      host: '127.0.0.1',
      port: 53306,
      database: 'sheu_shiji',
      username: 'root',
      password: 'root',
    },
  };
  // const localDB = {
  //   host: '127.0.0.1',
  //   port: 53306,
  //   database: 'luv_db_2',
  //   username: 'root',
  //   password: 'root',
  // };

  config.sequelize = {
    dialect: 'mysql',
    // ...gongfu_kuaisong,
    ...SheuShiJiServer.local,
    timezone: '+08:00',
    pool: {
      max: 100,
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

  /**
   * redis 缓存配置
   */
  config.redis = {
    client: {
      port: 6379, // Redis port
      // host: '101.201.239.227', // Redis host http://101.201.239.227/
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
