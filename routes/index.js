var express = require('express');
var router = express.Router();
const accountModel = require("../model/account");
const fs = require("fs");
const { body } = require('express-validator');

let data = fs.readFileSync("./data.json");
let dataJson = JSON.parse(data);

fs.watch("./data.json", (event, filename) => {
  if (event == "change") {
    console.log("data.json changed");
    data = fs.readFileSync("./data.json");
    dataJson = JSON.parse(data);
  }
})

function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

function checkAdmin(req, res, next) {
  if (req.session.user) {
    if (req.session.user.isAdmin) {
      next();
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}

/* GET home page. */
router.get('/', checkLogin, function (req, res, next) {
  res.sendFile("views/index_kiet.html", { root: 'public' });
});

router.get('/login', function (req, res, next) {
  if (!req.session.user) {
    res.sendFile("views/login.html", { root: 'public' });
  } else {
    res.redirect("/");
  }
});

router.post('/login', async function (req, res, next) {
  const username = req.body.loginUsername;
  const password = req.body.loginPassword;
  console.log(username, password);
  if (!(username || password)) {
    res.sendFile("views/login.html", { root: 'public' });
  } else {
    try {
      let acc = await accountModel.findOne({ username: username, password: password });
      console.log(acc);
      if (acc != null) {
        req.session.user = acc;
        res.redirect("/");
      } else {
        res.sendFile("views/login.html", { root: 'public' });
      }
    } catch (err) {
      console.log(err);
      res.sendFile("views/login.html", { root: 'public' });
    }
  }
});



router.get('/profile', checkLogin, function (req, res, next) {
  res.sendFile("views/profile.html", { root: 'public' });
});

router.get('/admin', checkLogin, checkAdmin, function (req, res, next) {
  res.sendFile("views/admin.html", { root: 'public' });
});

router.get('/setting', checkLogin, function (req, res, next) {
  res.sendFile("views/setting.html", { root: 'public' });
});

//GET API genID
router.get('/web/api/genIDv1', function (req, res, next) {
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
router.get("/web/api/genIDv2", async (req, res, next) => {
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
  let id = -1;
  //auth check here 
  if (!req.session.user) {
    res.json("not login").status(404);
    return;
  } else {
    id = req.session.user.deviceID;
  }
  if (id == -1 || id == undefined) {
    res.json("id is undefined").status(404);
    return;
  }
  //auth check here
  try {
    let noti = await accountModel.findOne({ deviceID: id }, { noti: 1 });
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

router.get("/web/api/getListDevice", async (req, res, next) => {
  //auth check here
  if (!req.session.user) {
    res.json("not login").status(404);
    return;
  }
  if (!req.session.user.isAdmin) {
    res.json("not admin").status(404);
    return;
  }
  try {
    let accounts = await accountModel.find({}, { location: 1, information: 1, deviceID: 1 });
    if (accounts != null) {
      res.json(accounts).status(200);
    } else {
      res.json("accounts is null").status(400);
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
