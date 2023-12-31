const mongoose = require('mongoose')
const panelSchema = new mongoose.Schema(
    {
        idPoint: {type: String, require: true},

        // loại bảng quảng cáo
        Paneltype: {type: String, require: true},
        amount: {type: Number, require: true},
        size: {type: String, require: true},// 2.3m x 10m
        picturePanel: {type: String, require: true},
        //ngày hết hạn
        expDate: {type: Date, require: true},
    },
    {
        timestamps: true,
    }
);

const Panel = mongoose.model("Panel", panelSchema);
module.exports = Panel;