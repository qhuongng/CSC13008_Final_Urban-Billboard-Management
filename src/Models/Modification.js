const mongoose = require('mongoose')
const modificationSchema = new mongoose.Schema(
    {
        idPoint: String,
        idPanel: String, // "-1" nếu là điểm đặt
        changedList: Array,
        reason: String,
        state: Number // 0: chưa duyệt, -1 : bị từ chối, 1: chấp nhập
    },
    {
        timestamps: true,
    }
);

const Modification = mongoose.model("Modification", modificationSchema);
module.exports = Modification;