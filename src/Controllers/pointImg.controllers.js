const pointImgServices = require("../Services/pointImg.services")

const getImgPoint = async (req, res) => {
    try {
        const imageId = req.params.id
        if (!imageId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The Imageid is required'
            })
        }
        const img = await pointImgServices.getPointImg(imageId);
        res.contentType(img.data.contentType);
        res.send(img.data.data);
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }

}

const upImgPoint = async (req, res) => {
    console.log(req.files);
    try {
        const file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
        const savedFile = (await pointImgServices.sendPointImg(file)).data;
        console.log(savedFile.data);
        res.status(200).json(savedFile.data._id)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

module.exports = {
    getImgPoint,
    upImgPoint
}