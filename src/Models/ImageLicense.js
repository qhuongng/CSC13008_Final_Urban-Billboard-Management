const mongoose = require('mongoose')
const imgLicenseSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const ImageLicense = mongoose.model('ImageLicense', imgLicenseSchema);

module.exports = ImageLicense;