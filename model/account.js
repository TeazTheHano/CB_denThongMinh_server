//create an account model have username, password, id, tempID, measure, control, noti
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    isAdmin: Boolean,
    deviceID: { type: String, default: "" },
    tempID: String,
    measure: [
        {
            time: Date,
            temp: Number,
            humi: Number,
            dust: Number,
            mq7: Number,
        }
    ],
    noti: [
        {
            time: Date,
            type: {
                type: String,
                enum: ['newDevice', 'newUser', 'alarm', 'normal'],
                default: 'normal'
            },
            title: String,
            content: String,
            isRead: Boolean,
            isNew: Boolean,
        }
    ],
});

accountSchema.virtual('measureCount').get(function () {
    return this.measure.length;
});

accountSchema.virtual('notiCount').get(function () {
    return this.noti.length;
});

accountSchema.virtual("unreadNotiCount").get(function () {
    let count = 0;
    for (let i = 0; i < this.noti.length; i++) {
        if (this.noti[i].isRead === false) {
            count++;
        }
    }
    return count;
});

accountSchema.virtual("newNotiCount").get(function () {
    let count = 0;
    for (let i = 0; i < this.noti.length; i++) {
        if (this.noti[i].isNew === true) {
            count++;
        }
    }
    return count;
});

const accountModel = mongoose.model('account', accountSchema);