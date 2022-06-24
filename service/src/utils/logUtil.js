var jsonUtil = require('../utils/jsonUtil');
var log4js = require('log4js');

var log_config = require('../../config/log.config');
var stringUtil = require('../utils/stringUtil');
var config = require('../../config/basic.config');
const moment = require('moment');
//加载配置文件
log4js.configure(log_config);
var logUtil = {};

var errorLogger = log4js.getLogger('errorLogger');
var resLogger = log4js.getLogger('resLogger');
const thirdPartLogger = log4js.getLogger('thirdPartLogger');
logUtil.thirdPartLogger = thirdPartLogger;

//格式化请求日志
var formatReqLog = function (req, resTime) {
    var logText = '';

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = '';

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};


//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = '';

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

}

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));

    }
};

//封装第三方成功日志
logUtil.thirdPartSuccess = function(thirdPartType, operation, args, result) {
    var logText = '';

    //第三方日志开始
    logText += "\n" + "*************** third part log start ***************";

    logText += "\nthirdPartType: " + thirdPartType;
    logText += "\noperation: " + operation;
    logText += "\nargs: " + JSON.stringify(args);

    // result = JSON.stringify(result);
    // if (result && result.length > 150) result = result.slice(0, 150) + '...';
    // logText += "\nresult: " + result;
    logText += "\ndatetime: " + moment().format('YYYY-MM-DD HH:mm:ss');

    //第三方日志结束
    logText += "\n*************** third part log end ***************" + "\n";

    thirdPartLogger.info(logText);
};
//封装第三方异常日志
logUtil.thirdPartError = function(thirdPartType, operation, args, error) {
    var logText = '';

    //第三方日志开始
    logText += "\n" + "*************** third part error start ***************";

    logText += "\nthirdPartType: " + thirdPartType;
    logText += "\noperation: " + operation;
    logText += "\nargs: " + JSON.stringify(args);
    if (error instanceof Error) {
        //错误名称
        logText += "\nerr name: " + error.name + "\n";
        //错误信息
        logText += "\nerr message: " + error.message + "\n";
        //错误详情
        logText += "\nerr stack: " + error.stack + "\n";
    } else {
        logText += "\nerr: " + JSON.stringify(error);
    }
    logText += "\ndatetime: " + moment().format('YYYY-MM-DD HH:mm:ss');

    //第三方日志结束
    logText += "\n*************** third part error end ***************" + "\n";

    thirdPartLogger.error(logText);
};
  logUtil.logThirdPart = (thirdPartType, operation, args, data) => {
    if (data instanceof Error) {
      // eslint-disable-next-line prefer-rest-params
      return logUtil.thirdPartError(thirdPartType, operation, args, data);
    }
    // eslint-disable-next-line prefer-rest-params
    return logUtil.thirdPartSuccess(thirdPartType, operation, args, data);
  };
  





module.exports = logUtil;
