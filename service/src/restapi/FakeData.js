import KoaRouter from "koa-router";
import moment from "moment";
const router = new KoaRouter();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
router.prefix = "/fakeData";
const { MongoClient } = require("mongodb");

Array.prototype.removeDup = function() {
  var result = [];
  var obj = {};
  
  for (var i = 0; i < this.length; i++) {
  
      if (!obj[this[i]]) {
          result.push(this[i]);
          obj[this[i]] = 1;
      }
  }
  return result;  
};
// 生成随机姓名
function getRandomName() {
  var firstNames = new Array(
      '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '楮', '卫', '蒋', '沈', '韩', '杨',
      '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜',
      '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎',
      '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐',
      '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
      '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄',
      '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧',
      '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁',
      '杜', '阮', '蓝', '闽', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭',
      '梅', '盛', '林', '刁', '锺', '徐', '丘', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍',
      '虞', '万', '支', '柯', '昝', '管', '卢', '莫', '经', '房', '裘', '缪', '干', '解', '应', '宗',
      '丁', '宣', '贲', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚',
      '程', '嵇', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '麹', '家', '封',
      '芮', '羿', '储', '靳', '汲', '邴', '糜', '松', '井', '段', '富', '巫', '乌', '焦', '巴', '弓',
      '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全', '郗', '班', '仰', '秋', '仲', '伊', '宫',
      '宁', '仇', '栾', '暴', '甘', '斜', '厉', '戎', '祖', '武', '符', '刘', '景', '詹', '束', '龙',
      '叶', '幸', '司', '韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '邰', '从', '鄂',
      '索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥', '能', '苍', '双',
      '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申', '扶', '堵', '冉', '宰', '郦', '雍',
      '郤', '璩', '桑', '桂', '濮', '牛', '寿', '通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农',
      '温', '别', '庄', '晏', '柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容',
      '向', '古', '易', '慎', '戈', '廖', '庾', '终', '暨', '居', '衡', '步', '都', '耿', '满', '弘',
      '匡', '国', '文', '寇', '广', '禄', '阙', '东', '欧', '殳', '沃', '利', '蔚', '越', '夔', '隆',
      '师', '巩', '厍', '聂', '晁', '勾', '敖', '融', '冷', '訾', '辛', '阚', '那', '简', '饶', '空',
      '曾', '毋', '沙', '乜', '养', '鞠', '须', '丰', '巢', '关', '蒯', '相', '查', '后', '荆', '红',
      '游', '竺', '权', '逑', '盖', '益', '桓', '公', '仉', '督', '晋', '楚', '阎', '法', '汝', '鄢',
      '涂', '钦', '岳', '帅', '缑', '亢', '况', '后', '有', '琴', '归', '海', '墨', '哈', '谯', '笪',
      '年', '爱', '阳', '佟', '商', '牟', '佘', '佴', '伯', '赏',"万俟", "司马", "上官", "欧阳", "夏侯",
      "诸葛", "闻人", "东方", "赫连", "皇甫", "尉迟", "公羊", "澹台", "公冶", "宗政", "濮阳", "淳于", 
      "单于", "太叔", "申屠", "公孙", "仲孙", "轩辕", "令狐", "锺离", "宇文", "长孙", "慕容", "鲜于", 
      "闾丘", "司徒", "司空", "丌官", "司寇", "子车", "微生", "颛孙", "端木", "巫马", "公西", "漆雕", 
      "乐正", "壤驷", "公良", "拓拔", "夹谷", "宰父", "谷梁", "段干", "百里", "东郭", "南门", "呼延", 
      "羊舌", "梁丘", "左丘", "东门", "西门", "南宫"
  );
  
  var lastNames =  new Array(
      '子璇', '淼', '国栋', '夫子', '瑞堂', '甜', '敏', '尚', '国贤', '贺祥', '晨涛',
      '昊轩', '易轩', '益辰', '益帆', '益冉', '瑾春', '瑾昆', '春齐', '杨', '文昊',
      '东东', '雄霖', '浩晨', '熙涵', '溶溶', '冰枫', '欣欣', '宜豪', '欣慧', '建政',
      '美欣', '淑慧', '文轩', '文杰', '欣源', '忠林', '榕润', '欣汝', '慧嘉', '新建',
      '建林', '亦菲', '林', '冰洁', '佳欣', '涵涵', '禹辰', '淳美', '泽惠', '伟洋',
      '涵越', '润丽', '翔', '淑华', '晶莹', '凌晶', '苒溪', '雨涵', '嘉怡', '佳毅',
      '子辰', '佳琪', '紫轩', '瑞辰', '昕蕊', '萌', '明远', '欣宜', '泽远', '欣怡',
      '佳怡', '佳惠', '晨茜', '晨璐', '运昊', '汝鑫', '淑君', '晶滢', '润莎', '榕汕',
      '佳钰', '佳玉', '晓庆', '一鸣', '语晨', '添池', '添昊', '雨泽', '雅晗', '雅涵',
      '清妍', '诗悦', '嘉乐', '晨涵', '天赫', '玥傲', '佳昊', '天昊', '萌萌', '若萌',
      "秋白", "南风", "醉山", "初彤", "凝海", "紫文", "凌晴", "香卉", "雅琴", "傲安", 
      "傲之", "初蝶", "寻桃", "代芹", "诗霜", "春柏", "绿夏", "碧灵", "诗柳", "夏柳", 
      "采白", "慕梅", "乐安", "冬菱", "紫安", "宛凝", "雨雪", "易真", "安荷", "静竹", 
      "飞雪", "雪兰", "雅霜", "从蓉", "冷雪", "靖巧", "翠丝", "觅翠", "凡白", "乐蓉", 
      "迎波", "丹烟", "梦旋", "书双", "念桃", "夜天", "海桃", "青香", "恨风", "安筠", 
      "觅柔", "初南", "秋蝶", "千易", "安露", "诗蕊", "山雁", "友菱", "香露", "晓兰", 
      "涵瑶", "秋柔", "思菱", "醉柳", "以寒", "迎夏", "向雪", "香莲", "以丹", "依凝", 
      "如柏", "雁菱", "凝竹", "宛白", "初柔", "南蕾", "书萱", "梦槐", "香芹", "南琴", 
      "绿海", "沛儿", "晓瑶", "听春", "易巧", "念云", "晓灵", "静枫", "夏蓉", "如南", 
      "幼丝", "秋白", "冰安", "凝蝶", "紫雪", "念双", "念真", "曼寒", "凡霜", "白卉", 
      "语山", "冷珍", "秋翠", "夏柳", "如之", "忆南", "书易", "翠桃", "寄瑶", "如曼", 
      "问柳", "香梅", "幻桃", "又菡", "春绿", "醉蝶", "亦绿", "诗珊", "听芹", "新之", 
      "博瀚", "博超", "才哲", "才俊", "成和", "成弘", "昊苍", "昊昊", "昊空", "昊乾", 
      "昊然", "昊然", "昊天", "昊焱", "昊英", "浩波", "浩博", "浩初", "浩大", "浩宕", 
      "浩荡", "浩歌", "浩广", "浩涆", "浩瀚", "浩浩", "浩慨", "浩旷", "浩阔", "浩漫", 
      "浩淼", "浩渺", "浩邈", "浩气", "浩然", "浩穰", "浩壤", "浩思", "浩言", "皓轩", 
      "和蔼", "和安", "和昶", "翔东", "昊伟", "楚桥", "智霖", "浩杰", "炎承", "思哲", 
      "璟新", "楚怀", "继智", "昭旺", "俊泽", "子中", "羽睿", "嘉雷", "鸿翔", "明轩", 
      "棋齐", "轶乐", "昭易", "臻翔", "泽鑫", "芮军", "浩奕", "宏明", "忠贤", "锦辉", 
      "元毅", "霈胜", "宇峻", "子博", "语霖", "胜佑", "俊涛", "浩淇", "乐航", "泽楷", 
      "嘉宁", "敬宣", "韦宁", "建新", "宇怀", "皓玄", "冠捷", "俊铭", "一鸣", "堂耀", 
      "轩凝", "舰曦", "跃鑫", "梓杰", "筱宇", "弘涛", "羿天", "广嘉", "陆铭", "志卿", 
      "连彬", "景智", "孟昕", "羿然", "文渊", "羿楦", "晗昱", "晗日", "涵畅", "涵涤",
      "昊穹", "涵亮", "涵忍", "涵容", "俊可", "智鹏", "诚钰", "书墨", "俊易", "浩渺", 
      "宸水", "嘉许", "时贤", "飞腾", "沂晨", "殿斌", "霄鸿", "辰略", "澜鸿", "景博", 
      "咨涵", "修德", "景辉", "语旋", "智逸", "鸿锋", "思梵", "弈煊", "泰河", "逞宇", 
      "嘉颢", "锦沅", "颢焱", "萧彬", "悦升", "香音", "烨柠", "颢咏", "仁贤", "尚然", 
      "羿鳞", "月鸿", "健霖", "鸿昊", "竣杰", "可顺", "炯乐", "俊彦", "海沧", "捷明", 
      "飞扬", "杰辰", "羽捷", "曦晴", "裕鸿", "翌锦", "沐宸", "福同", "旻驰", "龙宁", 
      "文虹", "义凡", "广晨", "宸滔", "嘉岐", "雅珺", "睿明", "皓轩", "程天", "子酝", 
      "艾康", "如羽", "冠玉", "子歉", "永昊", "龙华", "兆颜", "奇文", "月昕", "裕锦", 
      "昂佳", "昊浩", "宇韬", "睿焓", "永译", "鸿彬", "颢霖", "益彬", "虹昊", "飞悦", 
      "睿珏","?宵童", "睿鸿", "容冰", "逸濠", "楷岩", "弘义", "海萦", "昊孺", "梓铭", 
      "生钊", "蓝玺", "晨辕", "宇菡", "砚海", "文揩", "韬瑞", "彦红", "奕韦", "清予", 
      "宁翼", "冬睿", "锦昌", "烨宁", "昌权", "国研", "德运", "孝清", "佳阳", "凯玮", 
      "正真", "民云", "昕冶", "力威", "帅欣", "知淳", "烨飞", "兴远", "子墨", "澄欣", 
      "烨煊", "悦勤", "晨津", "博宏", "育萌", "羽炫", "绍钧", "睿昌", "泓千", "颢炜", 
      "虹金", "筠航", "元甲", "星明", "景涛", "铭虹", "德本", "向辉", "基翔", "家易", 
      "欣鹏", "羽荃", "泽容", "弘亮", "尚廷", "轩梓", "甫津", "彬楷", "寅飞", "愉君", 
      "阳平", "誉杰", "钦昭", "蕴藉", "羽程", "宏海", "涵畅", "光浩", "令沂", "浩浩", 
      "睿锦", "易泽", "俊康", "家文", "晨元", "语洋", "裕宏", "梓榛", "阳嘉", "恒展", 
      "雨远", "哲伊", "逸江", "丰源", "学东", "奇岩", "浩财", "和蔼", "红言", "瑞赫", 
      "森圆", "欣赢", "梓鸿", "博明", "铭育", "颢硕", "宇烯", "宇如", "淳炎", "源承", 
      "斌彬", "飞沉", "鸿璐", "昊弘"
  );
  
  lastNames = lastNames.removeDup();
  
  var firstLength = firstNames.length;
  var lastLength = lastNames.length;
  
  var i = parseInt(  Math.random() * firstLength );
  var j = parseInt(  Math.random() * lastLength );
  var name = firstNames[i] + lastNames[j];
  return name;
}

// 生成随机ip
const ipv4 = {
  random: function (subnet="192.0.0.0", mask=8) {
    // generate random address (integer)
    // if the mask is 20, then it's an integer between
    // 1 and 2^(32-20)
    let randomIp = Math.floor(Math.random() * Math.pow(2, 32 - mask)) + 1;
    console.log(this.lon2ip(this.ip2lon(subnet) | randomIp))
    return this.lon2ip(this.ip2lon(subnet) | randomIp);
  },
  ip2lon: function (address) {
    let result = 0;
    
    address.split('.').forEach(function(octet) {
      result <<= 8;
      result += parseInt(octet, 10);
    });

    return result >>> 0;
  },
  lon2ip: function (lon) {
    return [lon >>> 24, lon >> 16 & 255, lon >> 8 & 255, lon & 255].join('.');
  }
};

// 生成随机身份证号
function getId_no(value) {
  if (value && value.includes(",")) {
    let arr = value.split(",");
    let l = arr.length;
    let r = getRndInteger(0, l);
    return arr[r];
  }
  var coefficientArray = [
    "7",
    "9",
    "10",
    "5",
    "8",
    "4",
    "2",
    "1",
    "6",
    "3",
    "7",
    "9",
    "10",
    "5",
    "8",
    "4",
    "2",
  ]; // 加权因子
  var lastNumberArray = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; // 校验码
  var address = "420101"; // 住址
  var birthday = "19810101"; // 生日
  var s =
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString();
  var array = (address + birthday + s).split("");
  var total = 0;
  for (let i in array) {
    total = total + parseInt(array[i]) * parseInt(coefficientArray[i]);
  }
  var lastNumber = lastNumberArray[parseInt(total % 11)];
  var id_no_String = address + birthday + s + lastNumber;
  return id_no_String;
}

// 生成随机email
function getEmail(value) {
  console.log(value);
  let email_suffix =
    "@gmail.com,@yahoo.com,@msn.com,@hotmail.com,@aol.com,@ask.com,@live.com,@qq.com,@0355.net,@163.com,@163.net,@263.net,@3721.net,@yeah.net,@googlemail.com,@126.com,@sina.com,@sohu.com,@yahoo.com.cn";
  if (value && value.includes(",")) {
    let arr = value.split(",");
    let l = arr.length;
    let r = getRndInteger(0, l);
    return arr[r];
  }
  var chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  var string = "";
  for (var ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  let arr = email_suffix.split(",");
  let r = getRndInteger(0, arr.length);
  return string + arr[r];
}

// 生成随机字符串
function randomString(value) {
  let e = value.length;
  if (value && value.includes(",")) {
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
  if (typeof value === "number") {
    value = value.toString();
  }
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

const generateData = async (values, db) => {
  let newObj = {};
  let promise = Object.keys(values).map(async (key) => {
    // 不知原始添加的值&&不包含_id
    if (
      key !== "_id" &&
      !key.substring(0, 4).includes("Type") &&
      !key.substring(0, 5).includes("Value")
    ) {
      // 如果值为对象就递归
      if (Object.prototype.toString.call(values[key]) === "[object Object]") {
        newObj[key] = await generateData(values[key], db);
      } else {
        // 生成指定值
        if (!values["Type" + key] || values["Type" + key] === "zdz") {
          // 生成date和ObjectId
          if (values["ValueType" + key] === "objId") {
            newObj[key] = ObjectId(values[key]);
          } else if (values["ValueType" + key] === "date") {
            newObj[key] = new Date(values[key]);
          } else {
            newObj[key] = values[key] 
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
            case "email":
              newObj[key] = getEmail(values[key]);
              break;
            case "sfz":
              newObj[key] = getId_no(values[key]);
              break;
            case 'xm':
              newObj[key] = getRandomName();
              break;
            case "ip":
              newObj[key] = ipv4.random(values[key]);
              break;
            case "objId":
              newObj[key] = await randomObjectId(values[key], key, db);
              return newObj[key];
            default:
              break;
          }
        }
      }
    }
  });
  await Promise.all(promise);
  return newObj;
};

async function formatData({ generateNum, ...values }, db) {
  let expArr = [];
  for (let i = 0; i < generateNum; i++) {
    console.log(i);
    let v = await generateData(values, db);
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
  let { collection, mongodburl, database, ...data } = ctx.request.body;
  const client = new MongoClient(mongodburl);
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(database);
    let newData = await formatData(data, db);
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
  const { mongodburl, database, collection } = ctx.request.body;
  const client = new MongoClient(mongodburl);
  try {
    await client.connect();
    console.log("Connect to database!");
    const db = client.db(database);
    const result = await db.collection(collection).findOne();
    Object.keys(result).forEach((key) => {
      if (result[key] && result[key]._bsontype) {
        result[key] = "objId" + ObjectId(result[key]).toString();
      }
      if (result[key] instanceof Date) {
        result[key] = "date" + result[key];
      }
    });
    ctx.body = result;
  } catch (e) {
    ctx.body = e.errmsg;
  }
});

export default router;