const defaultTextAttrs = {
  fontFamily: "Microsoft YaHei",
  fontSize: 20,
  fontStyle: "normal",
  textDecoration: "",
};
const fonts = [
  {
    name: "微软雅黑",
    fontFamily: "Microsoft YaHei",
  },
  { name: "fantasy", fontFamily: "Fantasy" }, // 本地
  { name: "sans-serif", fontFamily: "sans-serif" }, // 本地
  {
    name: "frutiger",
    fontFamily: "frutiger",
    url: "http://lib.mytac.cn/frutiger.ttf", // 远程，需要下载到本地
  },
  {
    name: "Blackletter",
    fontFamily: "Blackletter",
    url: "http://lib.mytac.cn/Blackletter.TTF", // 远程，需要下载到本地
  },
];
export { defaultTextAttrs, fonts };
