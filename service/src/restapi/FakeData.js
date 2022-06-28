import KoaRouter from "koa-router";
import moment from "moment";
const router = new KoaRouter();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
router.prefix = "/fakeData";
const { MongoClient } = require("mongodb");

// 生成随机字符串
function randomString(value) {
  let e = value.length;
  if (value.includes(",")) {
    let arr = value.split(",");
    let l = arr.length;
    let r = getRndInteger(0, l);
    return arr[r];
  }
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}
// 随机数字
function randomn(value) {
  let n = value.length;
  if (value.includes(",")) {
    let arr = value.split(",");
    let l = arr.length;
    let r = getRndInteger(0, l);
    return parseInt(arr[r]);
  } else if (n > 21) return null;
  return parseInt((Math.random() + 1) * Math.pow(10, n - 1));
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// 随机日期
function randomDate(n) {
  console.log(n);
  // 随机生成0-11的数字
  const randomMonthNum = Math.floor(Math.random() * 11);
  // 随机生成1-30数字
  const randomDateNum = Math.ceil(Math.random() * 30);
  let a = moment(new Date(n[1]));
  let b = moment(new Date(n[0]));
  let max = a.diff(b, "days");
  let randomDays = getRndInteger(0, max);
  console.log(randomDays);
  let date = new Date(a.subtract(randomDays, "days").format());
  return date;
}

//自动生成电话号码
function getMoble() {
  var prefixArray = new Array(
    "130",
    "131",
    "132",
    "133",
    "135",
    "137",
    "138",
    "170",
    "187",
    "189"
  );

  var i = parseInt(10 * Math.random());

  var prefix = prefixArray[i];

  for (var j = 0; j < 8; j++) {
    prefix = prefix + Math.floor(Math.random() * 10);
  }

  return prefix;
}

// 随机ObjectId
async function randomObjectId(str, key, db) {
  if (str.includes(",")) {
    let arr = str.split(",");
    let l = arr.length;
    let r = getRndInteger(0, l);
    return ObjectId(arr[r]);
  } else {
    if (key.substr(key.length - 1, 1) !== "s") {
      key = key + "s";
    }
    key = key.toLowerCase();
    const dbCursor = await db
      .collection(key)
      .find({}, { _id: 1 })
      .batchSize(100);
    if (!(await dbCursor.count())) {
      // TODO: 提前结束，做一些其它操作
      return;
    }
    let arrData = [];
    // 方法一：
    for await (const data of dbCursor) {
      arrData.push(data._id);
    }
    let l = getRndInteger(0, arrData.length);
    return arrData[l];
  }
}

// 随机车牌号
function getPlate(total = 5) {
  let stateList =
    "京津冀晋辽吉沪苏浙皖闽琼赣鲁豫鄂湘粤渝川贵云陕甘蒙黑桂藏青宁新";
  let charList = "ABCDEFGHJKLMNQPRSTUVWXYZ";
  let numList = "1234567890";
  let halfList = [charList, numList];
  let state = dicingChar(stateList);
  let city = dicingChar(charList);
  let sequence = "";
  while (total--) {
    sequence += dicingChar(halfList[Math.round(Math.random())]);
  }
  console.log(`${state}${city} ${sequence}`);
  return `${state}${city} ${sequence}`;
}

function dicingChar(series) {
  return series[~~(Math.random() * series.length)];
}
const generateData = async (values, keyArr, db) => {
  const datakeys = Object.keys(values);
  let newObj = {};
  let promise = datakeys.map(async (key) => {
    if (keyArr.includes(key)) {
      // 生成指定值
      if (!values["Type" + key] || values["Type" + key] === "zdz") {
        // 生成date和ObjectId
        if (values["ValueType" + key] === "objId") {
          newObj[key] = ObjectId(values[key]);
        } else if (values["ValueType" + key] === "date") {
          newObj[key] = new Date(values[key]);
        } else {
          newObj[key] = values[key];
        }
      } else if (values["Type" + key] === "sjs") {
        // 生成随机值
        switch (values["ValueType" + key]) {
          case "str":
            newObj[key] = randomString(values[key]);
            break;
          case "num":
            newObj[key] = randomn(values[key]);
            break;
          case "bool":
            newObj[key] = Math.random() >= 0.5;
            break;
          case "date":
            newObj[key] = randomDate(values[key]);
            break;
          case "tel":
            newObj[key] = getMoble();
            break;
          case "cph":
            newObj[key] = getPlate();
            break;
          case "objId":
            newObj[key] =  await randomObjectId(values[key], key, db);
            return newObj[key] 
          default:
            break;
        }
      }
    }
  });
  await Promise.all(promise);
  return newObj;
};

async function formatData(values, keyArr, db) {
  let expArr = [];
  for (let i = 0; i < values.generateNum; i++) {
    console.log(i);
    let v = await generateData(values, keyArr, db);
    expArr.push(v);
  }
  return expArr;
}

/**
 * 插入假数据
 * params {
 *  day: number
 * }
 *
 */
router.post("/batchInsert", async (ctx) => {
  let { keyArr, collection, mongodburl, dbName, ...data } = ctx.request.body;
  const client = new MongoClient(mongodburl);
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(dbName);
    let newData = await formatData(data, keyArr, db);
    const result = await db.collection(collection).insertMany(newData);
    console.log(result);
    ctx.body = result.result;
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
});

// 获取数据
router.post("/getOne", async (ctx) => {
  const { mongodburl, dbName, collection } = ctx.request.body;
  console.log(mongodburl, dbName, collection);
  const client = new MongoClient(mongodburl);
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(dbName);
    const result = await db.collection(collection).findOne();
    Object.keys(result).forEach((key) => {
      if (result[key]._bsontype) {
        result[key] ='objId'+ ObjectId(result[key]).toString();
      }
      if(result[key] instanceof Date){
        result[key] = 'date'+result[key]
      }
    });
    ctx.body = result;
  } catch (e) {
    ctx.body = e.errmsg;
  }
});

export default router;
