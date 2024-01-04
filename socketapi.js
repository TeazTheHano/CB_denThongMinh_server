
const fs = require("fs");

let data = fs.readFileSync("./data.json");
let dataJson = JSON.parse(data);

fs.watch("./data.json", (event, filename) => {
    if (event == "change") {
        // console.log("data.json changed");
        data = fs.readFileSync("./data.json");
        dataJson = JSON.parse(data);
    }
})


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

io.on("connection", (socket) => {
    console.log("[SOCKET] new connection: [" + socket.id + "]");
    socket.on("message", (data) => {
        console.log(`message from ${data.clientID} on topic message`);
        socket.broadcast.emit("message", data);
    });

    socket.on("/esp/measure", (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic /esp/measure`);
        //send data to web client
        socket.broadcast.emit('/web/measure', data);
        //add to data.json
        dataJson.forEach(device => {
            if (device.id == data.clientID) {
                device.measure.push({
                    time: Date.now(),
                    temp: data.temp,
                    humi: data.humi,
                    dust: data.dust,
                    mq7: data.mq7,
                })
            }
        });
        fs.writeFileSync("./data.json", JSON.stringify(dataJson));
    });

    socket.on("/web/control", (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic /web/control`);
        console.log(data);
        socket.broadcast.emit("/esp/control", data);
    });

    socket.on("esp/other", (data) => {
        console.log(`[SOCKET] message from ${data.clientID} on topic esp/other`);
        socket.broadcast.emit("web/other", data);
        console.log(data);
    });


    /***********register************ */
    socket.on("/esp/register-req", (data) => {
        console.log("[SOCKET] get message for register");
        console.log(`tempID: ${data.tempID}`);
        //broadcast to all device 
        socket.broadcast.emit("/web/register-req", data);
    })
    socket.on("/web/register-done", (data) => {
        console.log(data);
        //check if username is exist
        let check = "";
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