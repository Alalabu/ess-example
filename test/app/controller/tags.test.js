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

//     // 1. 查询商铺标签
//     // const data = {
//     //   // area_id: 'c74cb34091a711eab6ad6b97809d4796', // 理工大金花
//     //   area_id: '8673e16d904411eabe3100ff9846b53f', // 理工大曲江
//     //   hasStore: true,
//     // };
//     // return app.httpRequest().get(`/tags/findAll?area_id=${data.area_id}&hasStore=${data.hasStore}`).set(headers).then( res => {
//     //   console.log('/tags/findAll => ', util.inspect(res.body, true, 4));
//     // });

//     // 2. 查询商铺标签下的订单标签
//     // const data = {
//     //   storetag_id: '77a035aae0d711e9b04954bf64582633',
//     // };
//     // return app.httpRequest().get(`/order_tags/findAll?storetag_id=${data.storetag_id}`).set(headers).then( res => {
//     //   console.log('/order_tags/findAll => ', util.inspect(res.body, true, 4));
//     // });

//   });
// });
