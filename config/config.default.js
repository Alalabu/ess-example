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
      '/wechat/in',
      '/util/province/findAll',
      '/util/city/findAll',
      '/util/district/findAll',
      '/util/location/geocoder',
      '/client/login',
      '/seller/login',
      '/order/client_pay/pay_notify',
      '/order/client_pay/refund_notify',
    ],
    pa_allowed: [// pa的接口
      '/mgr/banner/create','/mgr/banner/delete','/mgr/area/findAll','/mgr/area/tablesign','/mgr/seller/auditList',
      '/mgr/seller/auditOne',
      '/mgr/seller/audit','/mgr/seller/change_struts','/mgr/knight/create','/mgr/knight/update','/mgr/knight/remove',
      '/mgr/store_tags/create', '/mgr/store_tags/update', '/mgr/store_tags/delete', '/mgr/store_tags/find',
      '/mgr/order_tags/create', '/mgr/order_tags/update', '/mgr/order_tags/delete', '/mgr/order_tags/find',
    ],
    sa_allowed: [// sa的接口
      '/mgr/area/create', '/mgr/area/update', '/mgr/area/delete', '/mgr/gm/create', '/mgr/gm/update', '/mgr/gm/delete', 
      '/mgr/gm/change_auth', '/mgr/gm/find', '/mgr/gm/findAll',
    ],
  };

  /**
   * 配置服务器启动项
   */
  config.cluster = {
    listen: {
      port: 56000,
    },
  };

  /**
   * 日志配置
   */
  config.logger = {
    // outputJSON: true,
    dir: '../logs/sheu-bianmin',
  };

  /**
   * egg-seneca-slot 配置
   */
  // config.senecaSubserver = {
  //   appid: 'Alalabu',
  //   appsecret: '002f61118a6045d1ae7c49173805b0cd',
  //   server: {
  //     name: 'seller',
  //     port: 50871,
  //     title: '商户商品',
  //     describe: '提供商户/商品相关操作等',
  //   },
  //   gateway: {
  //     host: '127.0.0.1',
  //     port: 50805,
  //     type: 'tcp',
  //     version: 1.2,
  //   },
  //   devLog: false,
  // };

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
      database: 'sheu_shiji',
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
    ...SheuShiJiServer.gongfu,
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
      // console.log('【SQL】 => ', sql); // appInfo
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
      password: 'sheu_redis.20200429',
      db: 0,
    },
  };

  // 配置 amqplib
  config.amqplib = {
    client: {
      // url: 'amqp://localhost',
      connectOptions: {
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'bryan14',
        password: 'bho2005',
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: 'sheu',
      },
      // socketOptions: {
      //   cert: certificateAsBuffer, // client cert
      //   key: privateKeyAsBuffer, // client key
      //   passphrase: 'MySecretPassword', // passphrase for key
      //   ca: [caCertAsBuffer], // array of trusted CA certs
      // },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
