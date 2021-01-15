// 'use strict';
// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
// const util = require('util');
// const { app, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/goodsType.test.js', () => {

//   let ctx = null;
//   before(async () => {
//     ctx = app.mockContext();
//   });

//   it('should assert', () => {
//     const pkg = require('../../../package.json');
//     assert(app.config.keys.startsWith(pkg.name));
//   });

//   it('should GET /', () => {

//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkZGZkNzY5OTRlZTExZWFiZTMxMDBmZjk4NDZiNTNmIiwib3BlbmlkIjpudWxsLCJ1bmlvbmlkIjpudWxsLCJsZXZlbCI6Im1hc3RlciIsImlhdCI6MTU4OTM1NjMyNCwiZXhwIjoxNjIwODkyMzI0fQ.rVB6f5M8gs2fjxlikC-QJlEIflhNkS4r8uWerPw5pmY';
//     const headers = {
//       authorization: token,
//     };

//     // 1. 查询 findOne
//     // const data = {
//     //     // id: null,
//     //     code: 'mfkc',
//     //     // name: null,parent_code: null,create_at: null
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => k+'='+data[k]).join('&');
//     // const url = '/goodsType/findOne?' + params
//     // return app.httpRequest().get(url).set(headers).then( res => {
//     //   console.log('/goodsType/findOne => ', res.body);
//     // });

//     // // 2. 查询 findAll
//     // const data = {
//     //     // id: null,code: null,name: null,create_at: null,
//     //     // parent_code: 'staple',
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => k+'='+data[k]).join('&');
//     // const url = '/goodsType/findAll?' + params
//     // return app.httpRequest().get(url).set(headers).then( res => {
//     //   console.log('/goodsType/findAll => ', util.inspect(res.body, true, 7));
//     // });

//     // 3. 查询 类别子集
//     // const data = {
//     //   parent_code: 'staple',
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => k+'='+data[k]).join('&');
//     // const url = '/goodsType/children?' + params
//     // return app.httpRequest().get(url).set(headers).then( res => {
//     //   console.log('/goodsType/children => ', util.inspect(res.body, true, 3));
//     // });

//     // // 3. 变更 add
//     // const data = {
//     //     code: 'test',name: '测试',parent_code: 'staple'
//     // };
//     // const url = '/goodsType/add'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/goodsType/add => ', res.body);
//     // });

//     // // 4. 变更 update
//     // const data = {
//     //     id: 'e2158650dc4f11ea87b1bd110f50235a',
//     //     name: '测试啊啊啊',
//     // };
//     // const url = '/goodsType/update'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/goodsType/update => ', res.body);
//     // });

//     // // 5. 变更 remove
//     // const data = {
//     //     id: 'e2158650dc4f11ea87b1bd110f50235a',
//     // };
//     // const url = '/goodsType/remove'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/goodsType/remove => ', res.body);
//     // });

//   }); // it end!
// }); // describe end!
