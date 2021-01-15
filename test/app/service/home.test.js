// 'use strict';

// // const { Context } = require('egg');
// const { app } = require('egg-mock/bootstrap');
// // const HttpClient = require('../../../app/utils/http-client');
// // const WechatUtils = require('../../../app/utils/wx/WechatUtils');
// // import util = require('util');

// describe('test/app/service/Test.test.js', () => {
//   let ctx;

//   before(async () => {
//     ctx = app.mockContext();
//   });

//   it('sayHi', async () => {

//     const sequelize = ctx.model
//     const {XqSubSeller} = sequelize;
//     const result = await XqSubSeller.update({
//       username: sequelize.fn('CONCAT', sequelize.col('username'), '-01')
//     }, {
//       where: {
//         id: '27f96eb0965b11ea977a499e9e6f6f56'
//       }
//     });

//     console.log('修改时字符串拼接结果 ::', result);

//     // const result = await ctx.service.home.findAll(1);
//     // console.log('home.findAll ::', result);

//     // console.log('ctx.message : ', ctx.message);
//     // console.log('ctx.message : ', ctx.message.auth.noAuth());

//     // console.log('ctx.message : ', await ctx.service.area.provinceAll());

//     // console.log( 'token 365 : ', ctx.generateToken({ 
//     //   params: {
//     //     id: '2ddfd76994ee11eabe3100ff9846b53f',
//     //     openid: null,
//     //     unionid: null,
//     //     level: 'master'
//     //   },
//     //   secret: app.config.jwt.secret,
//     //   expiresIn: (365 * 24 * 60 * 60)
//     // }) );

//     // const token = ctx.generateToken({ 
//     //   params: {
//     //     id: 'f6cab4c0902911ea895487ada1408af5',
//     //     openid: 'oXqI34xeESmxszTrDT7Z3dE1NQ5Y',
//     //     unionid: 'ombW51bbmQXRynsTJv4CqTNelk-M',
//     //     level: 'master'
//     //   },
//     //   secret: app.config.jwt.secret,
//     //   expiresIn: (365 * 24 * 60 * 60)
//     // });
//     // const headers = {
//     //   authorization: token,
//     // };
//     // console.log('master token: ', token);

//   });
// });
