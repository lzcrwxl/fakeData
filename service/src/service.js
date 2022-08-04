import koaBody from "koa-body";
const Koa = require("koa");
// const Router = require('koa-router');
const service = new Koa();
const bodyParser = require("koa-bodyparser");
const koaStatic = require("koa-static"); // 加载静态文件
const path = require("path");
const fs = require("fs");
const mime = require("mime-types"); //需npm安装
// const logUtil = require('../src/utils/logUtil');
import router from "./router";

service.use(bodyParser());
function loadStaticFile() {
  return async (ctx, next) => {
    await koaStatic(path.resolve(__dirname, "../build"))(ctx, next);
  };
}
service.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
    },
  })
);

// 加载静态文件
service.use(loadStaticFile());

service.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  await next();
});

// service.use((ctx, next) => {
//   if (ctx.path.includes("image")) {
//     let filePath = path.join(__dirname, ctx.url); //图片地址
//     let file = null;
//     try {
//       file = fs.readFileSync(filePath); //读取文件
//     } catch (error) {
//       //如果服务器不存在请求的图片，返回默认图片
//       filePath = path.join(__dirname, "/images/default.png"); //默认图片地址
//       file = fs.readFileSync(filePath); //读取文件
//     }

//     let mimeType = mime.lookup(filePath); //读取图片文件类型
//     ctx.set("content-type", mimeType); //设置返回类型
//     ctx.body = file; //返回图片
//   }
// });

service.use(router.routes(), router.allowedMethods());
module.exports = service;
