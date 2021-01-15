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

//     // 1. 新增食材关联
//     // const data = {
//     //   store_id: '34f59790133b11eab54a3d3b855aa2c0',
//     //   goods_id: '59116160382811ea9bbd9bf7717d823d', 
//     //   foods: [
//     //     { food_id: 1, unit_num: 50 },
//     //     { food_id: 31, unit_num: 230 },
//     //     // { food_id: 57, unit_num: 80 },
//     //   ],
//     // };
//     // return app.httpRequest().post(`/goods/food/create`).send(data).set(headers).then( res => {
//     //   console.log('/goods/food/create => ', res.body);
//     // });

//     // 2. 移除食材关联
//     // const data = {
//     //   store_id: '34f59790133b11eab54a3d3b855aa2c0',
//     //   goods_id: '59116160382811ea9bbd9bf7717d823d', 
//     //   foods: [
//     //     { food_id: 1, unit_num: 50 },
//     //     { food_id: 31, unit_num: 230 },
//     //   ],
//     // };
//     // return app.httpRequest().post(`/goods/food/delete`).send(data).set(headers).then( res => {
//     //   console.log('/goods/food/delete => ', res.body);
//     // });

//     // 3. 查询商品食材关联列表
//     // const goods_id = '59116160382811ea9bbd9bf7717d823d';
//     // return app.httpRequest().get(`/goods/food/findAll?goods_id=${goods_id}`).set(headers).then( res => {
//     //   console.log('/goods/food/findAll => ', util.inspect(res.body, true, 5));
//     // });

//   });
// });
