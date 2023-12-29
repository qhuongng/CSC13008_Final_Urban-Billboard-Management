const mongoose = require('mongoose')
const reportTypeSchema = new mongoose.Schema(
    {
        reportId: { type: String, required: true },
        reportName: { type: String, required: true },
    }
);

const PositionType = mongoose.model("reportType", reportTypeSchema);
module.exports = PositionType;