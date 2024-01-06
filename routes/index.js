var express = require('express');
var router = express.Router();
const accountModel = require("../model/account");
const fs = require("fs");

let data = fs.readFileSync("./data.json");
let dataJson = JSON.parse(data);

fs.watch("./data.json", (event, filename) => {
  if (event == "change") {
    console.log("data.json changed");
    data = fs.readFileSync("./data.json");
    dataJson = JSON.parse(data);
  }
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.sendFile("views/index.html", { root: 'public' });
});

router.get('/profile', function (req, res, next) {
  res.sendFile("views/profile.html", { root: 'public' });
});

router.get('/admin', function (req, res, next) {
  res.sendFile("views/admin.html", { root: 'public' });
});

router.get('/setting', function (req, res, next) {
  res.sendFile("views/setting.html", { root: 'public' });
});

//GET API genID
router.get('/web/genIDv1', function (req, res, next) {
  let ids = [];
  for (let i = 0; i < dataJson.length; i++) {
    ids.push(dataJson[i].id);
  }
  console.log(ids);
  let maxid = 0;
  maxid = Math.max(...ids);
  let newid = 0;
  let status = 200;
  if (maxid !== -Infinity) {
    newid = maxid + 1;
    if (newid > 255) {
      newid = 0;
      status = 400;
    }
  } else {
    newid = 0;
  }
  res.send({ id: newid, status: status });
});

//GET API genID v2 MongoDB
router.get("/web/genIDv2", async (req, res, next) => {
  let ids = [];
  let maxid = 0;
  let newid = 0;
  let status = 200;
  try {
    let accounts = await accountModel.find({}, { deviceID: 1 });
    for (let i = 0; i < accounts.length; i++) {
      ids.push(accounts[i].deviceID);
    }
    console.log(ids);
    maxid = Math.max(...ids);
    console.log(maxid);
    if (maxid !== -Infinity) {
      newid = maxid + 1;
      if (newid > 255) {
        newid = 0;
        status = 400;
      }
    } else {
      newid = 0;
    }
    console.log(newid);
    res.send({ id: newid, status: status });
  } catch (err) {
    console.log(err);
    res.send({ id: newid, status: 400 });
  }
});

/**
 * @url : /web/api/getNoti?id=1
 * @method : GET
 * @param : id
 * @return : {noti:[], _id: ""}
 */
router.get("/web/api/getNoti", async (req, res, next) => {
  const id = req.query.id;
  if (id == undefined) {
    res.send("id is undefined");
    return;
  }
  //auth check here 

  //auth check here
  try {
    let noti = await accountModel.findOne({ id: id }, { noti: 1 });
    if (noti != null) {
      res.json(noti).status(200);
    } else {
      res.json("noti is null").status(400);
    }
  } catch (err) {
    console.log(err);
    res.json(err).status(400);
  }
});

//GET API get chart data
router.get("/web/getChartData", (req, res, next) => {
  const id = req.query.id;
  if (id == undefined) {
    res.send("id is undefined");
    return;
  }
  let chartData = [];
  for (let i = 0; i < dataJson.length; i++) {
    if (dataJson[i].id == id) {
      chartData.push({
        id: dataJson[i].id,
        measure: dataJson[i].measure,
      });
    }
  }
  res.send(chartData);
})
module.exports = router;
