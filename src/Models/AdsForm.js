const mongoose = require('mongoose')
const AdsformSchema = new mongoose.Schema(
    {
        formId: { type: String, required: true },
        formName: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const AdsForm = mongoose.model("AdsForm", AdsformSchema);
module.exports = AdsForm;