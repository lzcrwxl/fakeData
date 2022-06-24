const GlobalConfigs = require('../../config/globalConfigs');

const nodeEnv = process.env.NODE_ENV;
const globalConfigs = new GlobalConfigs(nodeEnv, 'service');
const config = {
    //端口
    app_port: globalConfigs.getPort('service'),
    
    // mongodb 配置
    mongodb: globalConfigs.getMongoDB(),
};

module.exports = config;
