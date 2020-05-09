# egg-seneca-server

以插件 `egg-seneca-subserver` 作为主要支持的 `Egg.js` 子服务骨架

## 快速启动

在 [网关](egg-seneca-gateway) 已启动的情况下，子服务启动将注册入网关。

### Development

```bash
$ git clone https://github.com/Alalabu/ess-example.git your-project
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### 唯一性

变更以下配置，以确保当前项目的进程**唯一性**：

#### 1. package.json

```json
{
  "name": "ess-example", 	// 你的项目进程名
  "version": "1.0.0",		// 版本
  "scripts": {
    "start": "egg-scripts start --daemon --env=prod --title=egg-server-ess-example",	// 你的项目进程名
    "stop": "egg-scripts stop --title=egg-server-ess-example",	// 你的项目进程名
  },
  ...
}
```

#### 2. package-lock.json

```json
{
  "name": "ess-example", 	// 你的项目进程名
  ...
}
```

#### 3. config/config.default.js

```js
module.exports = appInfo => {
	// 鉴权配置
  config.auth = {
    allowed: [ // 排除的接口
      '/home',
	  ...
    ],
  };

  // 配置服务器启动项
  config.cluster = {
    listen: {
      port: 50810, // 你的应用启动端口
    },
  };

  // 日志配置
  config.logger = {
    // outputJSON: true,
    dir: '../logs/ess-example',
  };

  // egg-seneca-slot 配置
  config.senecaSubserver = {
    appid: 'Alalabu',
    appsecret: 'your secret',
    server: {
      name: 'users', 	// 子服务名称
      port: 50812,		// 子服务数据交互端口
      title: '通用工具',	// 子服务标题(用于接口视图化)
      describe: '提供通用接口调用, 如城市、短信、图片操作等',	// 子服务说明
    },
    gateway: {
      host: '127.0.0.1',	// 网关地址
      port: 50805,			// 网关端口
      type: 'tcp',			// 网关交互模式
      version: 1.2,			// 当前子服务发送网关的版本
    },
    devLog: true,			// 是否开启控制台日志
  };

  // sequelize 相关配置

  // redis 相关配置

  ...
}
```

#### 4. 删除主目录下的 `git` 相关文件夹

```bash
$ rm -rf ./.git
$ rm -rf ./.github
```

## 骨架功能

骨架为项目开发过程提供部分通用能力:

```js
/**
 * 生成 Token
 * @param { Object } params token 封装参数
 * @param { String } secret token 解码密钥
 * @param { Number } expiresIn 生命周期, 单位: 秒
 */
(app || ctx).generateToken({ params = {}, secret, expiresIn = 24 * 60 * 60 });

// 每次调用, 获取一个过滤了 "-" 的 32 位 UUID
ctx.uuid32;
// 每次调用, 获取一个 36 位 UUID
ctx.uuid36;
// 返回一个当前时间的 Calendar2 对象
// 通过 ctx.NOW 下的 `toDate()` 或 `toDatetime()` 获取时间字符串
ctx.NOW;
// 返回一个 Sequelize.Op 对象
ctx.Op;

/**
 * 响应消息对象
 * 根据 `config/message.config.js` 载入应用响应消息模型
 * 假设配置如下('errlog'表示写入错误日志): 
 * {
 *   success: [ 0, 'SUCCESS' ],
 *   param: {
 *    invalid: [ 100, '参数无效!', 'errlog' ],
 *    miss: [ 101, '参数缺失!', 'errlog' ],
 *   },
 * }
 * 则 `ctx.message` 对象中包含以下消息:
 * 
 * - `ctx.message.success([detail]);` // 成功消息对象
 * -- 响应结果: {err: 0, msg: 'SUCCESS'}
 * 
 * - `ctx.message.param.invalid([detail]);` // 参数无效对象
 * -- 响应结果: {err: 100, msg: '参数无效!'}
 * 
 * - `ctx.message.param.miss([detail]);` // 参数缺失对象
 * -- 响应结果: {err: 101, msg: '参数缺失!'}
 * 
 */
ctx.message;

/**
 * json web token 对象
 * - 生成 token: (app || ctx).generateToken(param, secret, expiresIn)
 * - 解析 token: ctx.jwt.verify(token, secret);
 * -- 解析失败会抛出异常, 参考 `middleware/auth.js`
 */
ctx.jwt;

// 返回一个当前时间的时间戳
ctx.timeStamp;

// 返回一个长度是 len 的随机字符串
ctx.getNonceStr(len);

/**
 * 将参数和密钥进行 MD5 签名, 返回 sign 签名字符串
 * @param {Object} data 参数列表
 * @param {String} secret 密钥
 */
ctx.parseSign(data, secret);

/**
 * 解析签名, 返回解析结果. true则为解析成功, false为解析失败
 * @param {Object} data 参数列表
 * @param {String} secret 密钥
 * @param {String} sign 需要对比的签名
 */
ctx.equalsSign(data, secret, sign);
```

## 示例内容

项目目录下部分内容为 **示例内容**，开发过程中请将其移除，包含：

```bash
- app
-- controller/
-- service/
-- model/
-- router.js
```

## 约定
- 请为所有的 `controller`、`service` 函数编写单元测试用例，并确保可执行性；
- 将执行结果作为 **示例返回数据** 编辑至 `showdoc`