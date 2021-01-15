// 'use strict';

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

//     // 1. 新增频道
//     const data = {
//       store_id: 'f2a213009b4811eaa793cd394dd66c43', 
//       title: '第03频道', 
//       priority: 3,
//     };
//     return app.httpRequest().post(`/goodsch/create`).send(data).set(headers).then( res => {
//       console.log('/goodsch/create => ', res.body);
//     });

//     // 2. 修改频道
//     // const data = {
//     //   channel_id: 'f2b17c509b4811eaa793cd394dd66c43',
//     //   store_id: 'f2a213009b4811eaa793cd394dd66c43',
//     //   title: '第2频道', 
//     //   priority: 2,
//     // };
//     // return app.httpRequest().post(`/goodsch/update`).send(data).set(headers).then( res => {
//     //   console.log('/goodsch/update => ', res.body);
//     // });

//     // 3. 删除频道
//     // const data = {
//     //   channel_id: 'f2b17c509b4811eaa793cd394dd66c43',
//     //   store_id: 'f2a213009b4811eaa793cd394dd66c43',
//     // };
//     // return app.httpRequest().post(`/goodsch/delete`).send(data).set(headers).then( res => {
//     //   console.log('/goodsch/delete => ', res.body);
//     // });

//     // 4. 查询频道单例
//     // const channel_id = '4899bf9094f711eabd3db79cfa9b53b4';
//     // const has_goods = '';
//     // return app.httpRequest().get(`/goodsch/find?channel_id=${channel_id}&has_goods=${has_goods}`).set(headers).then( res => {
//     //   console.log('/goodsch/find => ', res.body);
//     // });

//     // 5. 查询频道列表
//     // const store_id = '0d4badc01bdc11ea848d310f9fd759db';
//     // const has_goods = 'true'; // 除非不拼接, 否则get方式的布尔值请求结果都是字符串
//     // return app.httpRequest().get(`/goodsch/findAll?store_id=${store_id}&has_goods=${has_goods}`).set(headers).then( res => {
//     //   console.log('/goodsch/findAll => ', res.body);
//     // });

//   });
// });
