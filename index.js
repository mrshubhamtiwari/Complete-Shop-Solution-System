const { app, BrowserWindow, ipcMain } = require("electron");
if (require("electron-squirrel-startup")) return app.quit();
var sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "Model/billing.db");
var db = new sqlite3.Database(dbPath);

const fs = require("fs");
var dir = "C:/assets";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

var billWindow;
var pdfWindow;
var home;
var pricelist;
var salesWindow;

function createHomeWindow() {
  home = new BrowserWindow({
    width: 800,
    height: 680,
    movable: true,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  home.loadFile("View/homepage.html");
  home.on("close", () => {
    home = null;
  });
  home.on("ready-to-show", () => {
    // console.log("sent username "+username)
    home.maximize();
    home.show();
    home.webContents.send("logUser", "Shubham");
  });
}

function createBillWindow(Data) {
  billWindow = new BrowserWindow({
    width: 800,
    height: 680,
    movable: true,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  billWindow.loadFile("View/generatebill.html");
  billWindow.on("close", () => {
    billWindow = null;
  });

  billWindow.on("ready-to-show", () => {
    billWindow.maximize();
    billWindow.show();
    db.get("SELECT MAX(invno) as m FROM invdtl", function (e, R, F) {
      if (R.m == null) {
        billWindow.webContents.send("serviceList", [1000, Data]);
      } else {
        billWindow.webContents.send("serviceList", [R.m, Data]);
      }
    });
  });
}

function createPriceListWindow() {
  pricelist = new BrowserWindow({
    width: 800,
    height: 680,
    movable: true,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  pricelist.loadFile("View/pricelist.html");
  pricelist.on("close", () => {
    pricelist = null;
  });

  pricelist.on("ready-to-show", () => {
    db.all(
      "SELECT servicename,servicecode,price FROM pricelist",
      function (err, result, fields) {
        if (err) throw err;
        let Data = [];
        let obj = null;
        result.forEach((element) => {
          obj = {
            serviceNamepl: element.servicename,
            serviceCodepl: element.servicecode,
            price: element.price,
          };
          Data.push(obj);
        });
        // console.log(Data);
        pricelist.maximize();
        pricelist.show();
        Data.push("end");
        pricelist.webContents.send("serviceList", Data);
      }
    );
  });
}

function createSalesWindow() {
  salesWindow = new BrowserWindow({
    width: 800,
    height: 680,
    movable: true,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  salesWindow.loadFile("View/salesReport.html");
  salesWindow.on("close", () => {
    salesWindow = null;
  });

  salesWindow.on("ready-to-show", () => {
    db.all(
      "SELECT invno,dte,pname,mob,address,price FROM invdtl",
      function (err, result, fields) {
        if (err) throw err;
        let Data = [];
        let obj = null;
        result.forEach((element) => {
          obj = {
            invoiceno: element.invno,
            date: element.dte,
            customerName: element.pname,
            mobile: element.mob,
            address: element.address,
            price: element.price,
          };
          Data.push(obj);
        });
        // console.log(Data);
        salesWindow.maximize();
        salesWindow.show();
        Data.push("end");
        salesWindow.webContents.send("Sales:Report", Data);
      }
    );
  });
}

function createPDFWindow(item) {
  pdfWindow = new BrowserWindow({
    width: 800,
    height: 680,
    movable: true,
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  pdfWindow.loadFile("View/pdf.html");
  pdfWindow.on("close", () => {
    pdfWindow = null;
  });
  pdfWindow.on("ready-to-show", () => {
    pdfWindow.maximize();
    pdfWindow.show();
    pdfWindow.webContents.send("billToF", item);
  });

  ipcMain.on("print-to-pdf", (e, data) => {
    var filepath1 =
      "C:/assets/" +
      item[0].date.replaceAll("/", "-") +
      "-INV-" +
      ++item[2] +
      ".pdf";
    var options = {
      marginsType: 0,
      pageSize: "A4",
      printBackground: true,
      printSelectionOnly: false,
      landscape: false,
    };
    let win = BrowserWindow.getFocusedWindow();
    win.webContents
      .printToPDF(options)
      .then((data) => {
        fs.writeFile(filepath1, data, function (err) {
          if (err) {
            console.log(err);
          } else {
            // console.log('PDF Generated Successfully');
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

app.on("ready", createHomeWindow);

ipcMain.on("select:change", (e, item) => {
  db.get(
    "SELECT price FROM pricelist WHERE servicecode=?",
    [item],
    function (err, result, fields) {
      if (err) throw err;
      let Price = 0;
      Price = result.price;
      // console.log(Price);
      billWindow.webContents.send("select:price", Price);
    }
  );
});

ipcMain.on("btnEvent:home", (e, item) => {
  createHomeWindow();
  billWindow.close();
});

ipcMain.on("btnEvent:pdftohome", (e, item) => {
  createHomeWindow();
  pdfWindow.close();
});

ipcMain.on("billTo", (e, item) => {
  db.run(
    `INSERT INTO invdtl(userid,dte,pname,mob,address,price) VALUES(?,?,?,?,?,?)`,
    [1, item[0].date, item[0].name, item[0].mobile, item[0].address, item[3]],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      createPDFWindow(item);
      billWindow.close();
    }
  );
});

ipcMain.on("open-home-window", (e, data) => {
  createHomeWindow();
  pricelist.close();
});

ipcMain.on("bill-btn-click", () => {
  db.all(
    "SELECT servicename,servicecode FROM pricelist",
    function (err, result, fields) {
      if (err) throw err;
      let Data = [];
      let obj = null;
      result.forEach((element) => {
        obj = {
          serviceNamepl: element.servicename,
          serviceCodepl: element.servicecode,
        };
        Data.push(obj);
      });
      createBillWindow(Data);
      home.close();
    }
  );
});

ipcMain.on("item-btn-click", () => {
  createPriceListWindow();
  home.close();
});
ipcMain.on("logout", () => {
  // createWindow();
  createHomeWindow();
  home.close();
});

ipcMain.on("AddValuesToDBPL", (e, item) => {
  db.run(
    `INSERT INTO pricelist(servicename,price) VALUES(?,?)`,
    [item.name, item.price],
    function (err) {
      if (err) {
        return console.log(err.message);
      }

      db.get(
        "SELECT servicename,servicecode,price FROM pricelist order by servicecode desc",
        function (err, result, fields) {
          if (err) throw err;
          let obj = {
            serviceNamepl: result.servicename,
            serviceCodepl: result.servicecode,
            price: result.price,
          };
          pricelist.webContents.send("serviceList", [obj, "x"]);
        }
      );
    }
  );
});

ipcMain.on("updatePriceList", (e, item) => {
  // console.log("update sence"+item)
  db.run(`DELETE FROM pricelist where servicecode=?`, [item], function (err) {
    if (err) {
      return console.log(err.message);
    }
    pricelist.webContents.send("updatePriceList:True");
  });
});

ipcMain.on("sales-btn-click", () => {
  createSalesWindow();
  home.close();
});
ipcMain.on("open-home-window-sales", (e, data) => {
  createHomeWindow();
  salesWindow.close();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("browser-window-created", (e, window) => {
  window.setMenu(null);
});
