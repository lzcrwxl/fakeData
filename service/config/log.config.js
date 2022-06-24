var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');
//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error.log";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// var errorLogPath = path.resolve(__dirname, "../logs/error/error");
//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response.log";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// 第三方日志目录
const thirdPartPath = '/thirdPart';
// 第三方日志文件名lllll
const thirdPartFileName = 'thirdPart.log';
// 第三方日志输出完整路径
const thirdPartLogPath = `${baseLogPath + thirdPartPath}/${thirdPartFileName}`;
// 设置保留多久的数据
const numBackups = 15;

module.exports = {
    baseLogPath: baseLogPath,
    paths: [errorPath, responsePath],
    pm2: true,
    appenders: {
        errorLogger: {//错误日志
            "type": "file",
            "filename": errorLogPath,
            "maxLogSize": 1024 * 520,
            "backups": 8
        },
        thirdPartLogger: {
            type: 'dateFile',
            filename: thirdPartLogPath,
            compress: true,
            pattern: '.yyyy-MM-dd',
            keepFileExt: true,
            daysToKeep: numBackups,
        },
        resLogger: {//响应日志
            "type": "file",
            "filename": responseLogPath,
            "maxLogSize": 1024 * 1024 * 2,
            "backups": 8
        }


    },
    categories: {
        default: { appenders: ['errorLogger'], level: 'error' },
        errorLogger: { appenders: ['errorLogger'], level: 'error' },
        resLogger: { appenders: ['resLogger'], level: 'info' },
        thirdPartLogger: { appenders: [ 'thirdPartLogger'], level: 'ALL' },

    }
}
