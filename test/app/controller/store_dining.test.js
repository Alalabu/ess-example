// 'use strict';
// const {Calendar, CalendarTypes} = require('calendar2');
// const _ = require('lodash');
// const util = require('util');
// const { app, assert } = require('egg-mock/bootstrap');

// describe('test/app/controller/storeDining.test.js', () => {

//   // const ctx = app.mockContext({});
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
//     //     id: '746531e0e10011ea97dc65866686398c'
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => k+'='+data[k]).join('&');
//     // const url = '/dining/findOne?' + params
//     // return app.httpRequest().get(url).set(headers).then( res => {
//     //   console.log('/dining/findOne => ', res.body);
//     // });

//     // 2. 查询 findAll
//     // const data = {
//     //     area_id: 'c74cb34091a711eab6ad6b97809d4796'
//     // };
//     // const params = Object.keys(data).filter(k => data[k]).map(k => k+'='+data[k]).join('&');
//     // const url = '/dining/findAll?' + params
//     // return app.httpRequest().get(url).set(headers).then( res => {
//     //   console.log('/dining/findAll => ', res.body);
//     // });

//     // 3. 变更 add
//     // const data = {
//     //     area_id: 'c74cb34091a711eab6ad6b97809d4796', name: '教职工餐厅', priority: 4
//     // };
//     // const url = '/dining/add'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/dining/add => ', res.body);
//     // });

//     // 4. 变更 update
//     // const data = {
//     //     id: '746531e0e10011ea97dc65866686398c',
//     //     // name: '第二餐厅',
//     //     priority: 3,
//     // };
//     // const url = '/dining/update'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/dining/update => ', res.body);
//     // });

//     // 5. 变更 remove
//     // const data = {
//     //     id: '746531e0e10011ea97dc65866686398c'
//     // };
//     // const url = '/dining/remove'
//     // return app.httpRequest().post(url).send(data).set(headers).then( res => {
//     //   console.log('/dining/remove => ', res.body);
//     // });

//   }); // it end!
// }); // describe end!
