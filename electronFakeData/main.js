const { app, BrowserWindow, ipcMain } = require("electron");

let mainWindow = null;

// 关闭后台服务
function stopServer() {
  const kill = require("tree-kill");
  if (serverProcess) {
    logger.info(
      "kill server process , serverProcess.pid-->",
      serverProcess.pid
    );

    kill(serverProcess.pid, "SIGTERM", function () {
      serverProcess = null;
      logger.info("后台服务已关闭...");
    });
  }
}
// 子进程名称
let serverProcess = null;
function startServer() {
  // 启动后台服务的命令
  let cmdStr = "./node_modules/.bin/nodemon ./config/run";
  // 启动路径
  let cmdPath = "../service";
  // 区分测试环境与生产环境
  //   let cmdPath = isDevelopment? "./server":"./resuorces/server"
  runExec(cmdStr);

  function runExec(cmdStr) {
    // 在启动后台服务前闲检测关闭一遍后台服务，防止开启多个后台服务
    stopServer();
    serverProcess = require("child_process").spawn(cmdStr, { cwd: cmdPath });
    // 启动成功的输出
    serverProcess.stdout.on("data", function (data) {
      console.log("启动服务器成功！ stdout:" + data);
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

  mainWindow.loadURL("http://127.0.0.1:3001/"); //根据自己的端口和ip修改 //打开开发者模式，开发环境请打开方便调试，生产环境需要禁用。

  mainWindow.webContents.openDevTools(); //判断是否是开发模式
}

//app主进程的事件和方法

app.on("ready", () => {
  startServer();
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
