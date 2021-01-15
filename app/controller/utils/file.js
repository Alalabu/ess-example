'use strict';
const _ = require('lodash');
const { aliossSignature } = require('../../util/upload/alioss');
const Controller = require('egg').Controller;

class FileController extends Controller {
  /**
   * 获取上传接口所需要的 Sign
   * 仅支持小程序在客户端获取签名之后直接上传, 无需发送文件至服务器端
   */
  async getWechatUploadSign() {
    const { ctx } = this;
    const {filepath, dir} = ctx.request.body;
    const ossdir = dir ?? 'sheu_shiji/';
    if (!filepath) {
      ctx.body = ctx.message.param.miss({ filepath, dir: ossdir });
      return;
    }
    ctx.body = ctx.message.success( await aliossSignature(filepath, ossdir) );
  }
}

module.exports = FileController;
