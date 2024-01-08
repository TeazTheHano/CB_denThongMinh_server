

const socket = io();

socket.on("connect", () => {
    console.log("connected");
    socket.emit("message", {
        clientID: "web",
        data1: "hello from web",
    });
});

socket.on("message", (data) => {
    console.log(data);
});

socket.on("/web/measure", (data) => {
    console.log(data);
});

socket.on("/web/control", (data) => {
    console.log(data);
});

socket.on("/web/register-req", function (data) {
    console.log("new device register request");

    console.log(data);
});

//register done event -- failed. if success, no event will be emitted back
socket.on("/web/register-fail", function (data) {
    console.log("register failed");
    console.log(data);
    alert("register failed: " + data.message);
});

socket.on("/web/reload-noti", function (data) {
    console.log("reload noti");
    console.log(data);
    fetchNoti();
})