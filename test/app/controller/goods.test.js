// // 'use strict';
// // const util = require('util');
// // const { app, assert } = require('egg-mock/bootstrap');

// // describe('test/app/controller/home.test.js', () => {
// //   it('should assert', () => {
// //     const pkg = require('../../../package.json');
// //     assert(app.config.keys.startsWith(pkg.name));

// //     // const ctx = app.mockContext({});
// //     // yield ctx.service.xx();
// //   });

// //   it('should GET /', () => {

// //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkZGZkNzY5OTRlZTExZWFiZTMxMDBmZjk4NDZiNTNmIiwib3BlbmlkIjpudWxsLCJ1bmlvbmlkIjpudWxsLCJsZXZlbCI6Im1hc3RlciIsImlhdCI6MTU4OTM1NjMyNCwiZXhwIjoxNjIwODkyMzI0fQ.rVB6f5M8gs2fjxlikC-QJlEIflhNkS4r8uWerPw5pmY';
// //     const headers = {
// //       authorization: token,
// //     };

// //     // 1. 新增商品
//     const data = {
//       area_id: 'c74cb34091a711eab6ad6b97809d4796',
//       store_id: '0d4badc01bdc11ea848d310f9fd759db', 
//       channel_id: '33c198e094f711ea9f0c3de893fa9ed6', 
//       goods_pic: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/xq_manager/storelogo/wx1b97a1ded75f9859.o6zAJs7f1HnJTpdzus8tFrKENZPU.oi3iCt5dhi9V7f3cd141fe4b9efdeece98d9b459b3b6.png', 
//       title: '第5-6商品', 
//       // good_type: '', 
//       price: 600, 
//       discount_price: 0, 
//       // glimit: 13, 
//       priority: 6, 
//       detail: '鲜香美味麻辣豆腐 5-6',
//     };
//     return app.httpRequest().post(`/goods/create`).send(data).set(headers).then( res => {
//       console.log('/goods/create => ', res.body);
//     });

// //     // 2. 修改商品
// //     // const data = {
// //     //   area_id: 'c74cb34091a711eab6ad6b97809d4796',
// //     //   goods_id: '96ecc4c09cbe11eab5a76ff5781770bc',
// //     //   store_id: 'f2a213009b4811eaa793cd394dd66c43',
// //     //   channel_id: '00b738d09cb611ea90a14bfb22155718', 
// //     //   // goods_pic: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/xq_manager/storelogo/wx1b97a1ded75f9859.o6zAJs7f1HnJTpdzus8tFrKENZPU.oi3iCt5dhi9V7f3cd141fe4b9efdeece98d9b459b3b6.png', 
// //     //   title: '商品5-1', 
// //     //   // good_type: '', 
// //     //   // price: 1300, 
// //     //   // discount_price: 1299, 
// //     //   // glimit: 0, 
// //     //   priority: 3, 
// //     //   detail: '原来是第 6-2 个商品, 现在是5-1',
// //     // };
// //     // return app.httpRequest().post(`/goods/update`).send(data).set(headers).then( res => {
// //     //   console.log('/goods/update => ', res.body);
// //     // });

// //     // 3. 删除商品
// //     // const data = {
// //     //   area_id: 'c74cb34091a711eab6ad6b97809d4796', 
// //     //   channel_id: '24f37f609cb611eab5740d6e7a3ab00a',
// //     //   goods_id: '55638c709cc111ea9081fdb440f2eb89',
// //     //   store_id: 'f2a213009b4811eaa793cd394dd66c43',
// //     // };
// //     // return app.httpRequest().post(`/goods/delete`).send(data).set(headers).then( res => {
// //     //   console.log('/goods/delete => ', res.body);
// //     // });

// //     // 4. 查询商品单例
// //     // const goods_id = '1a675bb3958811eaac2000ff9846b53f';
// //     // return app.httpRequest().get(`/goods/find?goods_id=${goods_id}`).set(headers).then( res => {
// //     //   console.log('/goods/find => ', res.body);
// //     // });

// //     // 5. 查询商品列表
// //     // const data = {
// //     //   // store_id: '0d4badc01bdc11ea848d310f9fd759db',
// //     //   // area_id: 'c74cb34091a711eab6ad6b97809d4796',
// //     //   // channel_id: '33c198e094f711ea9f0c3de893fa9ed6',
// //     //   keyword: encodeURI('饭'),
// //     //   sort: 'price_desc',
// //     //   pageIndex: 1,
// //     //   hasStore: '',
// //     // };
// //     // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
// //     // const url = `/goods/findAll?${params}`;
// //     // console.log('url : ', url);
// //     // return app.httpRequest().get(url).set(headers).then( res => {
// //     //   console.log('/goods/findAll => ', res.body);
// //     // });

// //     // 6. 测试商品模糊查询合并商铺
// //     // const w = encodeURI('面');
// //     // // console.log('word: ', w);
// //     // return app.httpRequest().get(`/goods/testAll?w=${w}`).set(headers).then( res => {
// //     //   console.log('/goods/testAll => ', util.inspect(res.body, true, 4));
// //     // });

// //   });
// // });
