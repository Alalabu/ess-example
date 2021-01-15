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

//     // 1. 商户(敏感)信息修改申请
//     // const data = {
//     //   store_id: '0d4badc01bdc11ea848d310f9fd759db',
//     //   // logourl, 
//     //   store_name: 'AJ超级实体店', 
//     //   // category, 
//     //   // area_id, 
//     //   address: '太白路主街道29号', 
//     //   // longitude, latitude, contcat, 
//     //   // seller_name, seller_phone, license, detail
//     // };
//     // return app.httpRequest().post(`/info/apply`).send(data).set(headers).then( res => {
//     //   console.log('/info/apply => ', res.body);
//     // });

//     // 2. 商户(非敏感)信息立即修改
//     // const data = {
//     //   store_id: '0d4badc01bdc11ea848d310f9fd759db',
//     //   biz_struts: '1', 
//     //   // can_delivery: '', 
//     //   // can_takeself: '', 
//     //   // can_eatin: '',
//     // };
//     // return app.httpRequest().post(`/info/update`).send(data).set(headers).then( res => {
//     //   console.log('/info/update => ', res.body);
//     // });

//     // 3. 商户添加子账号
//     // const data = {
//     //   store_id: '0d4badc01bdc11ea848d310f9fd759db',
//     //   username: '杨瑞代', 
//     //   gender: '0', 
//     //   phonenum: '18392019103',
//     // };
//     // return app.httpRequest().post(`/sub/create`).send(data).set(headers).then( res => {
//     //   console.log('/sub/create => ', res.body);
//     // });

//     // 4. 变更子账号状态
//     // const data = {
//     //   sub_id: '64057110965b11eaa0591350da496d06', 
//     //   struts: '1',
//     // };
//     // return app.httpRequest().post(`/sub/change_struts`).send(data).set(headers).then( res => {
//     //   console.log('/sub/change_struts => ', res.body);
//     // });

//     // 5. 查询子账号列表
//     const data = {
//       store_id: '0d4badc01bdc11ea848d310f9fd759db', 
//       struts: '1',
//     };
//     return app.httpRequest().get(`/sub/findAll?store_id=${data.store_id}&struts=${data.struts}`).set(headers).then( res => {
//       console.log('/sub/findAll => ', util.inspect(res.body, true, 4));
//     });

//   });
// });
