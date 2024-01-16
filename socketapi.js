
const fs = require("fs");
const mongoose = require("mongoose");
const accountModel = require("./model/account");
const { sessionMiddleware } = require("./app");
const sharedsession = require("express-socket.io-session");
const { isMongoReady } = require("./app");
let isDbReady = false;

isMongoReady
    .then(() => {
        isDbReady = true;
        console.log("System will use mongodb instead of data.json");
    }).catch(() => {
        isDbReady = false;
        console.log("System will use data.json instead of mongodb");
    })

let data;
let dataJson;

if (!isDbReady) {
    console.log("System will use data.json instead of mongodb");
    data = fs.readFileSync("./data.json");
    dataJson = JSON.parse(data);

    fs.watch("./data.json", (event, filename) => {
        if (event == "change") {
            // console.log("data.json changed");
            data = fs.readFileSync("./data.json");
            dataJson = JSON.parse(data);
        }
    })
} else {
    console.log("System will use mongodb instead of data.json");
}


const option = {
    allowEIO3: true,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
    },
}

const io = require("socket.io")(option);

const socketapi = {
    io: io
}

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}))

io.on("connection", (socket) => {
    // console.log(socket.handshake.session) //session of the current socket (only for loggged in user)
    console.log("[SOCKET] new connection: [" + socket.id + "]");
    socket.on("message", (data) => {
        console.log(`message from ${data.clientID} on topic message`);
        socket.broadcast.emit("message", data);
    });

    socket.on("/esp/measure", async (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic /esp/measure`);
        //send data to web client
        socket.broadcast.emit('/web/measure', data);

        if (!isDbReady) {
            //add to data.json
            dataJson.forEach(device => {
                if (device.id == data.clientID) {
                    device.measure.push({
                        time: Date.now(),
                        temp: data.data1.temp,
                        humi: data.data1.humi,
                        dust: data.data1.dust,
                        mq7: data.data1.mq7,
                    })
                }
            });
            fs.writeFileSync("./data.json", JSON.stringify(dataJson));
        }
        else {
            //add to mongodb
            try {
                let res = await accountModel.updateOne({ deviceID: data.clientID }, {
                    $push: {
                        measure: {
                            time: Date.now(),
                            temp: data.data1.temp,
                            humi: data.data1.humi,
                            dust: data.data1.dust,
                            mq7: data.data1.mq7,
                        }
                    }
                })
                if (res.acknowledged) console.log("added data to deviceID: " + data.clientID);
                else console.log("failed to add data");
            } catch (error) {
                console.log(error);
            }
        }
    });

    socket.on("/web/control", (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic /web/control`);
        console.log(data);
        if (!socket.handshake.session.user) {
            return;
        }
        if (socket.handshake.session.user.isAdmin) {
            //admin dont have deviceID
            console.log("[SOCKET - ALERT] admin dont have deviceID")
            return;
        }
        let outgoing = {
            ID: socket.handshake.session.user.deviceID,
            data: {
                step: Math.floor(data.horizonal * 200 / 360), //200 step means 360 degree
                servo: data.vertical, //0-180 degree
                light: Math.floor(data.brightness * 255 / 100), //0-255 //8bit
            }
        }
        console.log(outgoing);
        socket.broadcast.emit("/esp/control", outgoing);
    });

    socket.on("/esp/other", async (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic esp/other`);
        if (data.data == "RUNG") {
            try {
                console.log("got earthquake warning. Adding noti to mongodb");
                //add noti to all accs 
                let res = await accountModel.updateMany({}, {
                    $push: {
                        noti: {
                            time: Date.now(),
                            type: "alarm",
                            title: "Earthquake warning",
                            content: "Earthquake warning. Please check your device",
                            isRead: false,
                            isNotiNew: true,
                            isActive: true,
                        }
                    }
                });
                console.log("added noti to " + res.modifiedCount + " accs");
            } catch (error) {
                console.log(error);
            }
        }
        socket.broadcast.emit("web/other", data);
        console.log(data);
    });


    /***********register************ */
    socket.on("/esp/register-req", async (data) => {
        console.log("[SOCKET] get message for register");
        console.log(`tempID: ${data.tempID}`);
        //broadcast to all device 
        socket.broadcast.emit("/web/register-req", data);
        socket.broadcast.emit("/web/reload-noti", "oke");

        if (isDbReady) { //only add to mongodb
            try {
                console.log("adding noti to mongodb");
                let acc = await accountModel.findOne({ isAdmin: true });
                console.log(acc);
                acc.noti.push({
                    time: Date.now(),
                    type: "newDevice",
                    title: `New device TempID:  ${data.tempID}`,
                    content: "New device want to register. please check and set ID for it",
                    isRead: false,
                    isNotiNew: true,
                    isActive: true,
                })
                await acc.save();
                setTimeout(async () => {
                    acc.noti[acc.noti.length - 1].isActive = false;
                    await acc.save();
                }, 2 * 60 * 1000);
            } catch (error) {
                console.log(error);
            }
        }
    })
    socket.on("/web/register-done", async (data) => {
        console.log(data);
        //check if username is exist
        let check = "";
        if (!isDbReady) {
            for (let i = 0; i < dataJson.length; i++) {
                if (dataJson[i].username === data.username) {
                    check = "Username is exist";
                    break;
                }
                if (dataJson[i].id === data.id) {
                    check = "ID is exist";
                    break;
                }
            }
            //add new device to data.json
            if (check) {
                //send back to web client that register failed
                socket.emit("/web/register-fail", { status: 400, message: check });
                return;
            } else
                try {
                    dataJson.push(data);
                    fs.writeFileSync("./data.json", JSON.stringify(dataJson));
                    //broadcast to all device
                    console.log("request register done. Sending back to esp");
                    socket.broadcast.emit("/esp/register-done", data);
                } catch (error) {
                    console.log(error);
                    //send back to web client that register failed
                    socket.emit("/web/register-fail", { status: 500, message: "Server error" });
                }
        } else {
            let acc = await accountModel.findOne({ username: data.username })
            if (acc) {
                //send back to web client that register failed
                socket.emit("/web/register-fail", { status: 400, message: "Username is exist" });
                return;
            }
            acc = await accountModel.findOne({ deviceID: data.id });
            if (acc) {
                //send back to web client that register failed
                socket.emit("/web/register-fail", { status: 400, message: "deviceID is exist" });
                return;
            }
            else {
                try {
                    //add new device to mongodb
                    await accountModel.create(data);
                    //broadcast to all device
                    console.log("request register done. Sending back to esp");
                    socket.broadcast.emit("/esp/register-done", data);
                } catch (error) {
                    console.log(error);
                    //send back to web client that register failed
                    socket.emit("/web/register-fail", { status: 500, message: "Server error" });
                }
            }
        }
    })


    /**************************** */
    //xu ly chung
    socket.on("reconnect", function () {
        console.log("[" + socket.id + "] reconnect.");
    });
    socket.on("disconnect", () => {
        console.log("[" + socket.id + "] disconnect.");
    });
    socket.on("connect_error", (err) => {
        console.log(err.stack);
    });
})

module.exports = socketapi;