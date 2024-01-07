const mongoose = require('mongoose')
const imgReportSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const ImageReport = mongoose.model('ImageReport', imgReportSchema);

module.exports = ImageReport;