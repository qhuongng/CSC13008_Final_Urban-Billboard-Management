const mongoose = require('mongoose')
const districtSchema = new mongoose.Schema(
    {
        disId: { type: String, required: true },
        disName: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const District = mongoose.model("District", districtSchema);
module.exports = District;