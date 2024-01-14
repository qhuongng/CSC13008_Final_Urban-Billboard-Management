const mongoose = require('mongoose')
const imgPointSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String
});

const ImagePoint = mongoose.model('ImagePoint', imgPointSchema);

module.exports = ImagePoint;