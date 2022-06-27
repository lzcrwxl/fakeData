const Koa = require("koa");
// const Router = require('koa-router');
const service = new Koa();
const bodyParser = require("koa-bodyparser");
const koaStatic = require('koa-static'); // 加载静态文件
const path = require('path');
// const logUtil = require('../src/utils/logUtil');
service.use(bodyParser());

function loadStaticFile() {
  return async (ctx, next) => {
    await koaStatic(path.resolve(__dirname, "../build"))(ctx, next);
  };
}
// 加载静态文件
service.use(loadStaticFile());
// 健康检查中间件
service.use((ctx, next) => {
  if (ctx.path === "/service/system/healthy/ping") {
    ctx.body = "pong";
  } else {
    return next();
  }
});

import router from "./router";

service.use(router.routes(), router.allowedMethods());
module.exports = service;
