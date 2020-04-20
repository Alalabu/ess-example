'use strict';

const Controller = require('egg').Controller;

class AddressController extends Controller {
  async index() {
    const { ctx } = this;
    console.log('/address');
    ctx.body = { msg: '你正在访问/address', method: 'GET', params: ctx.query };
  }

  async new() {
    const { ctx } = this;
    console.log('/address/new');
    ctx.body = { msg: '你正在访问/address/new', method: 'GET', params: ctx.query };
  }

  async show() {
    const { ctx } = this;
    console.log('/address/:id');
    ctx.body = { msg: '你正在访问/address/:id', method: 'GET', params: ctx.query };
  }

  async edit() {
    const { ctx } = this;
    console.log('/address/:id/edit');
    ctx.body = { msg: '你正在访问/address/:id/edit', method: 'GET', params: ctx.query };
  }

  async create() {
    const { ctx } = this;
    console.log('/address');
    ctx.body = { msg: '你正在访问/address', method: 'POST', params: ctx.request.body };
  }

  async update() {
    const { ctx } = this;
    console.log('/address/:id');
    ctx.body = { msg: '你正在访问/address/:id', method: 'PUT', params: ctx.request.body };
  }

  async destroy() {
    const { ctx } = this;
    console.log('/address/:id');
    ctx.body = { msg: '你正在访问/address/:id', method: 'DELETE', params: ctx.request.body };
  }
}

module.exports = AddressController;
