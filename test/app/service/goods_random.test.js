// 'use strict';

// // const { Context } = require('egg');
// const { app } = require('egg-mock/bootstrap');
// // const HttpClient = require('../../../app/utils/http-client');
// // const WechatUtils = require('../../../app/utils/wx/WechatUtils');
// const util = require('util');

// describe('test/app/service/Test.test.js', () => {
//   let ctx;

//   before(async () => {
//     ctx = app.mockContext();
//   });

//   it('sayHi', async () => {

//     const param = {
//       area_id: 'c74cb34091a711eab6ad6b97809d4796',
//     };

//     const sequelize = ctx.model
//     const {GoodsType, Goods, XqStore} = sequelize;

//     const goodsList = await Goods.findAll({
//       attributes: ['id', 'store_id', 'goods_pic', 'title', 'price', 'discount_price', 'glimit', 'amount', 'detail', 'food_count'],
//       where: {struts: 1},
//       include: [{
//         model: GoodsType, where: { parent_code: 'staple' },
//         attributes: ['name'],
//       }, {
//         model: XqStore, where: {struts: '1', biz_struts: '1', area_id: param.area_id},
//         attributes: ['logourl', 'store_name', 'address'],
//       }], // 筛选主食
//       order: sequelize.fn('RAND'),
//       limit: 20,
//     });

//     const rawList = JSON.parse(JSON.stringify(goodsList));

//     console.log('按商品查询分类 ::', util.inspect(rawList, true, 3));

//     // 随机查询商品列表, 筛选10项
//     // const goodsOne = await Goods.findAll({
//     //   where: { id: '28163e40d6c111ea9a207b3b3ab36eb2' },
//     //   include: [{ model: GoodsType }],
//     // });

//     // console.log('按商品查询分类 ::', util.inspect(JSON.parse(JSON.stringify(goodsOne)), true, 4));

//   });
// });
