import KoaRouter from "koa-router";
const router = new KoaRouter();
const fs = require("fs");
const path = require("path");
router.prefix = "/konva";

/**
 * 上传图片
 *
 */
router.post("/uploadImg", async (ctx) => {
  try {
    const file = ctx.request.files.file; // 获取上传文件
    const reader = fs.createReadStream(file.filepath);

    let filePath = path.join(__dirname, "..\\..\\build\\static\\img\\") + `${file.originalFilename}`;
    console.log(filePath);
    // 创建可写流

    const upStream = fs.createWriteStream(filePath);

    // 可读流通过管道写入可写流

    reader.pipe(upStream);
    ctx.body = {
      url: '/static/img/' + `${file.originalFilename}`,
      server: '127.0.0.1',
    };
  } catch (e) {
    console.error(e);
  } finally {
  }
});

export default router;
