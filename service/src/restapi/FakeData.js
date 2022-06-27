import KoaRouter from "koa-router";
import moment from "moment";
const router = new KoaRouter();
const mongoose = require("mongoose");
router.prefix = "/fakeData";
const { MongoClient } = require("mongodb");

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
function randomObjectId(str) {
  let arr = str.split(",");
  let l = arr.length;
  let r = getRndInteger(0, l);
  return mongoose.Types.ObjectId(arr[r]);
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
        // 生成随机值
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
            newObj[key] = randomDate(values[key]);
            break;
          case "tel":
            newObj[key] = getMoble();
            break;
          case "cph":
            newObj[key] = getPlate();
            break;
          case "objId":
            newObj[key] = randomObjectId(values[key]);
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
  let { keyArr, collection, mongodburl, dbName, ...data } = ctx.request.body;
  let newData = formatData(data, keyArr);
  const client = new MongoClient(mongodburl);
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(dbName);
    console.log(collection);
    const result = await db.collection(collection).insertMany(newData);
    console.log(result);
    ctx.body = result.result;
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
  //   ctx.body =
});

export default router;
