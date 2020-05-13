'use strict';

// const { Context } = require('egg');
const { app } = require('egg-mock/bootstrap');
// const HttpClient = require('../../../app/utils/http-client');
// const WechatUtils = require('../../../app/utils/wx/WechatUtils');
// import util = require('util');

describe('test/app/service/Test.test.js', () => {
  let ctx;

  before(async () => {
    ctx = app.mockContext();
  });

  it('sayHi', async () => {

    // const result = await ctx.service.home.findAll(1);
    // console.log('home.findAll ::', result);

    // console.log('ctx.message : ', ctx.message);
    // console.log('ctx.message : ', ctx.message.auth.noAuth());

    // console.log('ctx.message : ', await ctx.service.area.provinceAll());

    // console.log( 'token 365 : ', ctx.generateToken({ 
    //   params: {
    //     id: 'd2f3f530213811eaa6652ddf602a53ce',
    //     openid: 'o2KHI5bwI8H51R8BQZrgBlOqsEq8',
    //     unionid: null,
    //   },
    //   secret: app.config.jwt.secret,
    //   expiresIn: (365 * 24 * 60 * 60)
    // }) );

  });
});
