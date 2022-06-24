const configs = require('../config/basic.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongoConnections = {};
const mongoDbModels = {};
const assert = require('assert');
class DB {
    static getMongoConnection(dbName) {
        let connection = null;
        if (!mongoConnections[dbName]) {
            assert(configs.mongodb.url, '无法获取mongodb url, 请检查无法获取mongodb配置是否正确')
            assert(configs.mongodb.dbNameMap, '无法获取 mongodb dbNameMap, 请检查无法获取mongodb配置是否正确')
            assert(configs.mongodb.dbNameMap[dbName], `获取 mongodb dbName 失败, 请检查 传入参数 ${dbName} 是否存在mongodb.dbNameMap配置中`)
            var db = mongoose.connection
            connection = mongoose.createConnection(`${configs.mongodb.url}/${configs.mongodb.dbNameMap[dbName]}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true, // 默认是true
                authSource: configs.mongodb.authSource,
                poolSize: 10,
            })
            db.on('error', async function (err) {
                console.error('Mongoose error:', err);
                mongoose.disconnect()
            })
            db.on('open', async (cb) => {
                console.log('open db connection:',configs.mongodb.url)
            })
            connection.on('connected', function (err) {
                if (err)
                    return err;
                else console.log('Mongoose connected: ', configs.mongodb.url)
            });

            connection.on('reconnected', function (err) {
                if (err)
                    return err;
                else console.log('Mongoose reconnected: ', configs.mongodb.url)
            });

            connection.on('error', function (err) {
                console.error('Mongoose error:', err);
                return err;
            });

            connection.on('disconnected', function () {
                return "Mongoose disconnected";
            });
            mongoConnections[dbName] = connection;
        } else {
            connection = mongoConnections[dbName];
        }
        return connection;
    }

    static getMongoDbModel(dbName, tableName) {
        assert(dbName || typeof dbName === 'string', 'DB.getDbModel dbName不能为空，且必须是字符串')
        assert(tableName || typeof tableName === 'string', 'DB.getDbModel tableName不能为空，且必须是字符串')
        let model = mongoDbModels[`${dbName}_${tableName}`];

        if (!model) {
            //构建用户信息表结构
            let connection = DB.getMongoConnection(dbName)
            let tableStructure = require(`./schemas/${dbName}/${tableName}`)
            const schema = new mongoose.Schema(tableStructure);

            //构建model
            model = connection.model(tableName, schema, tableName);
            // if (connection) {
            //     //根据mongoose.model方法的源码，若传入的connection不为空，需要手动执行init
            //     model.init();
            // }

            mongoDbModels[`${dbName}_${tableName}`] = model;
        }
        return model;
    }

}

module.exports = DB;