var express = require('express');
var router = express.Router();
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

//GET API genID
router.get('/web/genID', function (req, res, next) {
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
