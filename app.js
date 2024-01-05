var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

const mongouri = process.env.MONGO_URI ;
const mongo_username = process.env.MONGO_USERNAME || "";
const mongo_password = process.env.MONGO_PASSWORD || "";

if (mongouri == "") {
    console.log("[MONGODB] MONGO_URI is empty"); 
    console.log("[MONGODB] MONGODB will not be connected");
    console.log("System will use data.json instead of mongodb");
}

const mongoose = require("mongoose");

const isMongoReady = false;

async function connectDB() {
    try {
        await mongoose.connect(mongouri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            user: mongo_username,
            pass: mongo_password,
        });
        console.log("[MONGODB] connected");
        isMongoReady = true;
    }
    catch {
        console.log("[MONGODB] connect failed");
        console.log("[MONGODB] MONGODB will not be connected");
        console.log("System will use data.json instead of mongodb");
        isMongoReady = false;
    } finally {
        await mongoose.connection.close();
    }
}

connectDB().catch(console.error);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = {app, isMongoReady};
