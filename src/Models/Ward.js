const mongoose = require('mongoose')
const wardSchema = new mongoose.Schema(
    {
        wardId: { type: String, required: true },
        wardName: { type: String, required: true },
        districtRefId: { type: String, required: true }
    },
    {
        timestamps: true,
    }
);

const Ward = mongoose.model("Ward", wardSchema);
module.exports = Ward;