'use strict';
/**
 * 定义并导出插件
 * @param options 初始化插件时传递的参数
 */
const assert = require('assert');
const _ = require('lodash');
const PluginMath = function(options) {

  this.add('role:math, cmd:sum', (msg, respond) => {
    console.log('[serer:math:sum] 正在计算...', msg);
    respond(null, { answer: (msg.left + msg.right) });
  });

  this.add('init:PluginMath', (msg, respond) => {
    // 初始化操作
    console.log('[plagin: math] initing...', options);
    // 举例, 当初始化插件时, 比如传入参数: name 用以描述插件名称, 否则报错
    assert(options && _.isString(options.name), new Error('plugin\'s name must be a string.'));
    respond();
  });
};
module.exports = PluginMath;
