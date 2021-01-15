// 'use strict';

// // const { Context } = require('egg');
// const { app } = require('egg-mock/bootstrap');
// // const HttpClient = require('../../../app/utils/http-client');
// // const WechatUtils = require('../../../app/utils/wx/WechatUtils');
// // import util = require('util');

// describe('test/app/service/Test.test.js', () => {
//   let ctx;

//   before(async () => {
//     ctx = app.mockContext();
//   });

//   it('sayHi', async () => {

//     // 清除所有缓存
//     // const redis = ctx.service.base.base;
//     // const cacheKey = 'seller.store.list:c74cb34091a711eab6ad6b97809d4796';
//     // console.log('00 Hash Delete All: ', await redis.hashDeleteAll(cacheKey));

//     // Redis Hash Test
//     // const redis = ctx.service.base.base;
//     // const hashKey = 'buluo';
//     // const field01 = 'BaiHaiou'
//     // const value01 = { name: '白海鸥', age: 17, gender: '男' };
//     // const mdata = {
//     //   Huoyani: { name: '霍娅妮', age: 11, gender: '女' },
//     //   'Yezi': { name: '椰子', age: 22, gender: '男', id: ctx.uuid32 },
//     //   'Yingtao': { name: '樱桃', age: 19, gender: '女', struts: 'finish' },
//     // };

//     // console.log('00 Hash Delete All: ', await redis.hashDeleteAll(hashKey));

//     // console.log('01 Hash Values: ', await redis.hashGetValues(hashKey, false)); // []
//     // console.log('02 Hash Is Exists: ', await redis.hashExists(hashKey, field01));
//     // console.log('03 Hash Set Data: ', await redis.hashSetData(hashKey, field01, value01));

//     // console.log('04 Hash Get Data: ', await redis.hashGetData(hashKey, field01)); // []
//     // console.log('02 Hash Is Exists: ', await redis.hashExists(hashKey, field01));
//     // console.log('09 Hash Delete: ', await redis.hashDelete(hashKey, field01)); // []
//     // console.log('02 Hash Is Exists: ', await redis.hashExists(hashKey, field01));


//     // console.log('05 Hash Length: ', await redis.hashLength(hashKey)); // []
//     // console.log('06 Hash Entries: ', await redis.hashGetEntries(hashKey)); // []
//     // console.log('07 Hash Fields: ', await redis.hashGetFields(hashKey)); // []
//     // console.log('08 Hash Values: ', await redis.hashGetValues(hashKey)); // []

//     // console.log('10 Hash M Set : ', await redis.hashMSet({ key: hashKey, data: mdata }));
//     // console.log('11 Hash M Get : ', await redis.hashMGet({ key: hashKey, fields: Object.keys(mdata)}));

//     // console.log('09 Hash Delete: ', await redis.hashDelete(hashKey, field01)); // []
//     // console.log('20 Hash Length: ', await redis.hashLength(hashKey)); // []
//     // console.log('21 Hash Entries: ', await redis.hashGetEntries(hashKey)); // []
//     // console.log('22 Hash Values: ', await redis.hashGetValues(hashKey)); // []

//   });
// });
