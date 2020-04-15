'use strict';

class AppBootHook {

  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    // console.log('[Agent 01] [configWillLoad] ...');
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务
    // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
    // console.log('[Agent 02] [didLoad] ...');
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
    // console.log('[Agent 03] [willReady] ...');
  }

  async didReady() {
    // 应用已经启动完毕
    // 请将您的 app.beforeStart 中的代码置于此处。
    // console.log('[Agent 04] [didReady] ...');
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // console.log('[Agent 05] [serverDidReady] ...');

    // this.app.server.on('timeout', () => {
    //   // handle socket timeout
    // });
  }

  async beforeClose() {
    // 请将您的 app.beforeClose 中的代码置于此处。
    console.log('[Agent 06] [beforeClose] ...');
  }
}

module.exports = AppBootHook;
