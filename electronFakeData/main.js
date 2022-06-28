const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require('url');

let mainWindow = null;

// 关闭后台服务
function stopServer() {
  const kill = require("tree-kill");
  console.log("stop server");
  if (serverProcess) {
    console.log(
      "kill server process , serverProcess.pid-->",
      serverProcess.pid
    );

    kill(serverProcess.pid, "SIGTERM", function () {
      serverProcess = null;
      console.log("service closed ...");
    });
  }
}
// 子进程名称
let serverProcess = null;
function startServer() {
  // 启动后台服务的命令
  let cmdStr = "npm run service";
  // 启动路径
  let cmdPath = path.resolve(__dirname, "../service");
  // 区分测试环境与生产环境
  //   let cmdPath = isDevelopment? "./server":"./resuorces/server"
  runExec(cmdStr);

  function runExec(cmdStr) {
    // 在启动后台服务前闲检测关闭一遍后台服务，防止开启多个后台服务
    stopServer();
    console.log("cmdPath==========>", cmdPath);
    serverProcess = require("child_process").spawn(cmdStr, {
      cwd: cmdPath,
      shell: process.platform === "win32",
    });
    // 启动成功的输出
    serverProcess.stdout.on("data", function (data) {
      console.log("service start success! stdout:" + data);
    });
    // 发生错误的输出
    serverProcess.stderr.on("data", function (data) {
      console.log("stderr:" + data);
    });
    // 退出后的输出
    serverProcess.on("close", function (code) {
      console.log("out code:" + code);
    });
  }
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

  // 加载应用 --打包react应用后，__dirname为当前文件路径
  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, "./build/index.html"),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );
  mainWindow.loadURL("http://localhost:3001"); //根据自己的端口和ip修改 //打开开发者模式，开发环境请打开方便调试，生产环境需要禁用。

  // mainWindow.webContents.openDevTools(); //判断是否是开发模式
  // 窗口准备好之后，再显示
  // mainWindow.once("ready-to-show", (event) => {
  //   mainWindow.show();
  // });
}

//app主进程的事件和方法

app.on("ready", () => {
  startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  console.log(process.platform);
  if (process.platform !== "darwin") {
    stopServer();
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
