import KoaRouter from "koa-router";
import moment from "moment";
const router = new KoaRouter();
const mongoose = require("mongoose");
router.prefix = "/fakeData";
import DB from "../DB";
const { MongoClient } = require("mongodb");
const url = "mongodb://admin:123456@192.168.21.135:27017";
const client = new MongoClient(url);
const configs = require("../../config/basic.config");
// 生成随机字符串
function randomString(e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}
// 随机数字
function randomn(n) {
  if (n > 21) return null;
  return parseInt((Math.random() + 1) * Math.pow(10, n - 1));
}

// 随机日期
function randomDate(n) {
  return new Date(
    new Date().getTime() - 1000 * 60 * 60 * 2 * Math.floor(Math.random() * 1000)
  );
}

const generateData = (values, keyArr) => {
  let newObj = {};
  Object.keys(values).forEach((key) => {
    if (keyArr.includes(key)) {
      // 生成指定值
      if (!values["Type" + key] || values["Type" + key] === "zdz") {
        // 生成date和ObjectId
        if (values["ValueType" + key] === "objId") {
          newObj[key] = mongoose.Types.ObjectId(values[key]);
        } else if (values["ValueType" + key] === "date") {
          newObj[key] = new Date(values[key]);
        } else {
          newObj[key] = values[key];
        }
      } else if (values["Type" + key] === "sjs") {
        switch (values["ValueType" + key]) {
          case "str":
            newObj[key] = randomString(values[key].length);
            break;
          case "num":
            newObj[key] = randomn(values[key].length);
            break;
          case "bool":
            newObj[key] = Math.random() >= 0.5;
            break;
          case "date":
            newObj[key] = randomDate();
            break;
          default:
            break;
        }
      }
      // 生成随机值
    }
  });
  return newObj;
};

function formatData(values, keyArr) {
  let expArr = [];
  for (let i = 0; i < values.generateNum; i++) {
    console.log(i);
    let v = generateData(values, keyArr);
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
  let { keyArr, collection, ...data } = ctx.request.body;
  let newData = formatData(data, keyArr);
  const dbName = "ht";
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(dbName);
    console.log(collection)
    const result = await db.collection(collection).insertMany(newData);
    console.log(result);
    ctx.body = result.result
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
  //   ctx.body =
});

export default router;
