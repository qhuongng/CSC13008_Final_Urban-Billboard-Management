const mongoose = require('mongoose')
const licenseSchema = new mongoose.Schema({
    idPoint: String,
    idPanel: String,
    content: String,
    imageId: String,
    companyName: String,
    companyEmail: String,
    companyPhone: String,
    startDay: String,
    endDay: String,
    isAccept: Number// 0: chờ cấp phép, 1: đã cấp phép, -1: bị từ chối
}, { timestamps: true });

const License = mongoose.model('LicenseSchema', licenseSchema);

module.exports = License;