var AipContentCensorClient = require("baidu-aip-sdk").contentCensor;
var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 设置APPID/AK/SK
var APP_ID = "22110492";
var API_KEY = "mCZ6k9cVQzq5l4mNi65i1ZHB";
var SECRET_KEY = "TsiElnW5qUUj9dxLNU65v077VYZT1hnv";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY);

// 文本审核
const textCensor = content => new Promise((resolve, reject) => {
  return client.textCensorUserDefined(content).then(resolve, reject);
});

// 图片 url 审核
const imageUrlCensor = url => new Promise((resolve, reject) => {
  return client.imageCensorUserDefined(url, 'url').then(resolve, reject);
});

// 图片 Base64 审核
const imageBase64Censor = base64Img => new Promise((resolve, reject) => {
  return client.imageCensorUserDefined(base64Img, 'base64').then(resolve, reject);
});

module.exports =  {
  textCensor,
  imageUrlCensor,
  imageBase64Censor,
};