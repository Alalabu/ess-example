// 'use strict';
// const util = require('util');
// const { app, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/home.test.js', () => {
//   it('should assert', () => {
//     const pkg = require('../../../package.json');
//     assert(app.config.keys.startsWith(pkg.name));

//     // const ctx = app.mockContext({});
//     // yield ctx.service.xx();
//   });

//   it('should GET /', () => {

//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkZGZkNzY5OTRlZTExZWFiZTMxMDBmZjk4NDZiNTNmIiwib3BlbmlkIjpudWxsLCJ1bmlvbmlkIjpudWxsLCJsZXZlbCI6Im1hc3RlciIsImlhdCI6MTU4OTM1NjMyNCwiZXhwIjoxNjIwODkyMzI0fQ.rVB6f5M8gs2fjxlikC-QJlEIflhNkS4r8uWerPw5pmY';
//     const headers = {
//       authorization: token,
//     };

//     // 1. 查询商圈单例
//     // const lat = 34.18440077039931;
//     // const lng = 108.88424153645833;
//     // const data = {
//     //   // area_id: 'c74cb34091a711eab6ad6b97809d4796', // 理工大金花
//     //   // area_id: '8673e16d904411eabe3100ff9846b53f', // 理工大曲江
//     //   longitude: lng,
//     //   latitude: lat,
//     //   // hasStore: true,
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
//     // return app.httpRequest().get(`/area/find?${params}`).set(headers).then( res => {
//     //   console.log('/area/find => ', util.inspect(res.body, true, 3));
//     // });

//     // 2. 查询商圈列表
//     // const data = {
//     //   province: encodeURI('陕西省'), // 
//     //   // province: encodeURI('浙江省'), // 
//     //   // province_code: '610000', // 
//     //   // city: encodeURI('西安市'), // 
//     //   // city: encodeURI('温州市'), // 
//     //   // city_code: '610100', // 
//     //   // has_store_count: true,
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
//     // return app.httpRequest().get(`/area/findAll?${params}`).set(headers).then( res => {
//     //   console.log('/area/findAll => ', util.inspect(res.body, true, 3));
//     // });

//     // 3. 查询已开通商圈的省份
//     return app.httpRequest().get(`/area/findProvince`).set(headers).then( res => {
//       console.log('/area/findProvince => ', util.inspect(res.body, true, 4));
//     });

//   });
// });
