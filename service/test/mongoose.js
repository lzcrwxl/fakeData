// import {
//   mongodb_url as mongodbUrl
// } from '../../config/basic.config'
// import common from './common'
// const logger = LogUtil.getLogger('mongoose', 'mongoose')

const mongodbUrl = 'mongodb://test1:123456@192.168.21.30,192.168.21.31,192.168.21.32:27017/HTREPAIREDB?replicaSet=replica-db'
const logger = console
const mongoose = require('mongoose')

let _conn = null

var db = mongoose.connection
db.on('error', async function (err) {
  logger.error(err)
  mongoose.disconnect()
})
db.on('disconnected', async (event) => {
  logger.info('disconnected', event)
  // send mail to operation and maintenance

  DB.conn = mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: false, // 默认是true
    reconnectTries: Number.MAX_VALUE, // 默认也是30次 useUnifiedTopology为true时参数失效
    reconnectInterval: 6000, //默认是1000ms useUnifiedTopology为true时参数失效
    autoReconnect: true // useUnifiedTopology为true时参数失效
  })
})
db.on('open', async (cb) => {
  logger.info('open db connection')
  console.log('open db connection')
  if (process.globalEvent) {
    process.globalEvent.emit('db-open')
  }
})

class DB {
  constructor () {
    this.conn = null
  }
  async connect () {
    logger.debug('mongodbUrl: ', mongodbUrl)
    mongoose.set('useCreateIndex', true)
    mongoose.set('debug', function (collectionName, methodName, arg1, arg2, arg3, arg4) {
      let logMsg = ''
      logMsg = `Model ${collectionName} ${methodName} ${JSON.stringify(arg1)}`
      if (arg2) logMsg += ` ${JSON.stringify(arg2)}`
      if (arg3) logMsg += ` ${JSON.stringify(arg3)}`
      if (arg4) logMsg += ` ${JSON.stringify(arg4)}`
      logger.debug(logMsg)
    })
    mongoose.set('useFindAndModify', false)

    const areaSchema = new mongoose.Schema({
      name: {
        type: String
      }
    })
    mongoose.model('Area', areaSchema)

    this.conn = await mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      
      // 重连参数
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 1000, // 重试时间，默认30s
      // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // auto_reconnect:true,
      
      useUnifiedTopology: true, // 默认是true
      reconnectTries: Number.MAX_VALUE, // 默认也是30次 useUnifiedTopology为true时参数失效
      reconnectInterval: 6000, //默认是1000ms useUnifiedTopology为true时参数失效
      autoReconnect: true // useUnifiedTopology为true时参数失效
    })
    console.log('>>>>>>>>>>>>>>>> 1')
    _conn = this.conn
    const areas = await this.conn.model('Area').find({})
    console.log('areas: ', areas)
  }
}

const dbs = new DB()
dbs.connect()

module.exports = new DB()
