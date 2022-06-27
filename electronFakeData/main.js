const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow = null;
const exec = require("child_process").exec;

// 任何你期望执行的cmd命令，ls都可以
let cmdStr = "./node_modules/.bin/nodemon ./config/run";
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = "../service";
// 子进程名称
let workerProcess;

function runExec() {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  workerProcess = exec(cmdStr, { cwd: cmdPath });
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

  // 打印正常的后台可执行程序输出
  workerProcess.stdout.on("data", function (data) {
    console.log("stdout: " + data);
  });

  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on("data", function (data) {
    console.log("stderr: " + data);
  });

  // 退出之后的输出
  workerProcess.on("close", function (code) {
    console.log("out code：" + code);
  });
}

function createWindow() {
  const windowOptions = {
    //frame:false,

    width: 1200,

    height: 800,

    minWidth: 900,

    minHeight: 600,

    webPreferences: {
      webSecurity: false,

      nodeIntegration: true, // 是否集成 Nodejs
    },
  }; //创建electron窗口

  mainWindow = new BrowserWindow(windowOptions); //打开electron窗口后加载页面，次页面为react项目的首页，如果是静态页面，请修改中相应页面路径

  mainWindow.loadURL("http://127.0.0.1:3001/"); //根据自己的端口和ip修改 //打开开发者模式，开发环境请打开方便调试，生产环境需要禁用。

  // mainWindow.webContents.openDevTools(); //判断是否是开发模式
}

//app主进程的事件和方法

app.on("ready", () => {
  runExec() // 生效啦，可以做些什么执行一种相对的同步状态，例如判断输出内容到什么了
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});
