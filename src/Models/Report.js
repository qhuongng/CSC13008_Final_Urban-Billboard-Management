const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema(
    {
        idPanel: {type: String},// có thể có hoặc không
        // kinh - vĩ độ
        locate: {type: Array, require: true},
        //timeSend: {type: Date, require: true}, lấy thời gian từ timestamps
        reportType: {type: String, require:true},
        //reporter info
        name: {type: String, require: true},
        email: {type: String, require:true},
        phone: {type: String, require: true},
        // nội dung báo cáo
        content: {type: String, require: true},
        //dùng multer để lưu về máy
        reportPicture: {type: String, require: true},

        state: {type: Number, default: 0},// chưa xử lí
    },
    {
        timestamps: true,
    }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;