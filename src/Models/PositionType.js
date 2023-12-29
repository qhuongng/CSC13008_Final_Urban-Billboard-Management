const mongoose = require('mongoose')
const positionSchema = new mongoose.Schema(
    {
        posId: { type: String, required: true },
        posName: { type: String, required: true },
    }
);

const PositionType = mongoose.model("PositionType", positionSchema);
module.exports = PositionType;