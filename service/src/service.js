const Koa = require('koa');
// const Router = require('koa-router');
const db = require('./DB')
const service = new Koa();
const bodyParser = require('koa-bodyparser')

// const logUtil = require('../src/utils/logUtil');
service.use(bodyParser())

//记录日志
//添加格式化处理响应结果的中间件，在添加路由之前调用
// service.use(async(ctx, next) => {
//     //响应开始时间
//     const start = new Date();
//     //响应间隔时间
//     var ms;
//     try {
//         //开始进入到下一个中间件
//         await next();
//         ms = new Date() - start;
//         //记录响应日志
//         logUtil.logResponse(ctx, ms);
//         //注销 console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);
//     } catch (error) {
//         ms = new Date() - start;
//         //记录异常日志
//         setTimeout(()=>{
//             throw(error)
//         },0)
//         logUtil.logError(ctx, error, ms);
//         ctx.body={code:1,message:error.message||'service error',source:'service'}
//     }
// });

// 健康检查中间件
service.use((ctx, next) => {
    if (ctx.path === '/service/system/healthy/ping') {
        ctx.body = 'pong'
    } else {
        return next()
    }
})

import router from './router'

service.use(router.routes(), router.allowedMethods());
module.exports = service;
