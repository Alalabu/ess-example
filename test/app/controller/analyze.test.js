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
//     const data = {
//       area_id: 'c74cb34091a711eab6ad6b97809d4796', // 理工大金花
//       store_id: '0d4badc01bdc11ea848d310f9fd759db', // 理工大曲江
//     };
//     const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
//     return app.httpRequest().get(`/order/time_summary?${params}`).set(headers).then( res => {
//       console.log('/order/time_summary => ', util.inspect(res.body, true, 6));
//     });

//   });
// });
