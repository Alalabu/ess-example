'use strict';
const util = require('util');
const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
  it('should assert', () => {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', () => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJkZGZkNzY5OTRlZTExZWFiZTMxMDBmZjk4NDZiNTNmIiwib3BlbmlkIjpudWxsLCJ1bmlvbmlkIjpudWxsLCJsZXZlbCI6Im1hc3RlciIsImlhdCI6MTU4OTM1NjMyNCwiZXhwIjoxNjIwODkyMzI0fQ.rVB6f5M8gs2fjxlikC-QJlEIflhNkS4r8uWerPw5pmY';
    const headers = {
      authorization: token,
    };

    // 1. 查询商铺信息
    // const data = {
    //   store_id: '198a56301a7e11eb829a155be524cbf5', 
    //   has_channel: true, 
    //   has_goods: true,
    //   has_order_tags: true,
    // };
    // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
    // return app.httpRequest().get(`/info/find?${params}`).send(data).set(headers).then( res => {
    //   console.log('/info/find => ', util.inspect(res.body, true, 5));
    //   // console.log('/info/find => ', res.body);
    // });

    // 2. 查询商铺列表
    // const data = {
    //   // area_id: 'c74cb34091a711eab6ad6b97809d4796', // jinhua
    //   area_id: '8673e16d904411eabe3100ff9846b53f', // 曲江
    //   // city_code: '610100',
    //   // keyword: encodeURI('面'), 
    //   goods_limit: 3, 
    //   // longitude, latitude, sort, 
    //   pageIndex: 1,
    //   struts: '1', 
    //   biz_struts: '1', 
    //   // can_delivery: '0', 
    //   // can_takeself: '1', 
    //   // can_eatin: '1', 
    //   // can_tablesign: '0',
    //   // good_type: '9baf1f8adb8e11eabcf800163e00b07d', // fruits
    //   // good_type: "9baf1faadb8e11eabcf800163e00b07d", // 米饭
    //   // dining_id: '5aec2850e0ff11ea99cf13ac99dba370', // 餐厅id
    //   // hasDining: 'true',
    //   // good_type: ['9baf2005db8e11eabcf800163e00b07d','9baf1faadb8e11eabcf800163e00b07d'],
    //   // good_type: [],
    // };
    // // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
    // // const params = 'area_id=c74cb34091a711eab6ad6b97809d4796&goods_limit=3&pageIndex=1&struts=1&biz_struts=1';
    // // return app.httpRequest().get(`/info/findAll?${params}`).send(data).set(headers).then( res => {
    // //   console.log('/info/findAll => ', util.inspect(res.body, true, 4));
    // // });
    // return app.httpRequest().post(`/info/findAll`).send(data).set(headers).then( res => {
    //   console.log('/info/findAll => ', util.inspect(res.body, true, 4));
    // });

    // 3. 非用户端查询商铺信息
    const data = {
      // area_id: 'c74cb34091a711eab6ad6b97809d4796', 
      area_id: '93cfcc85967011ea84f700ff9846b53f',
      // city_code: '610100',
      // keyword: encodeURI('面'), 
      goods_limit: 3, 
      // longitude, latitude, sort, 
      pageIndex: 1,
      // pageLimit: '3',
      struts: '1', 
      biz_struts: '1', 
      // can_delivery: '0', 
      // can_takeself: '1', 
      // can_eatin: '1', 
      // can_tablesign: '0',
    };
    // const params = Object.keys(data).filter(k => data[k]).map(k => `${k}=${data[k]}`).join('&');
    return app.httpRequest().post(`/info/findAll`).send(data).set(headers).then( res => {
      console.log('/info/findAll => ', util.inspect(res.body, true, 3));
      // console.log('/info/findAll => ', res);
    });


  });
});
