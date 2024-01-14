const PointService = require("../Services/point.services");
const pointImgServices = require('../Services/pointImg.services')

const createPoint = async (req, res) => {
    try {
        const file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
        const savedFile = (await pointImgServices.sendPointImg(file)).data;


        const { _id, name, address, area, locate, positionType, formAdvertising } = req.body;
        if (!_id || !name || !address || !area || !locate || !positionType || !formAdvertising) {
            return res.status(404).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        req.body.picturePoint = savedFile._id;
        const response = await PointService.createPoint(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllPoint = async (req, res) => {
    try {
        const response = await PointService.getAllPoint();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getPointById = async (req, res) => {
    try {
        const pointId = req.params.id;
        if (!pointId) {
            return res.status(404).json({
                status: "ERR",
                message: "The pointId is required",
            });
        }

        const response = await PointService.getPointById(pointId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
}

const deletePoint = async (req, res) => {
    try {
        const pointId = req.params.id;
        //const token = req.headers
        if (!pointId) {
            return res.status(404).json({
                status: "ERR",
                message: "The pointId is required",
            });
        }

        const response = await PointService.deletePoint(pointId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const updatePoint = async (req, res) => {
    try {
        const pointId = req.params.id;
        const data = req.body;
        if (!pointId) {
            return res.status(404).json({
                status: "ERR",
                message: "The pointId is required",
            });
        }

        const response = await PointService.updatePoint(pointId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

// const updateHavePanel = async (req, res) => {
//     try {

//     } catch (e) {
//         return res.status(404).json({
//             message: e,
//         });
//     }
// }

const getPointByDis = async (req, res) => {
    try {
        const disName = req.params.name;
        const report = await PointService.getPointByDis(disName);
        if (report) {
            res.status(200).json(report);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const getPointByWardAndDis = async (req, res) => {
    try {
        const { wardName, districtName } = req.params;
        const report = await PointService.getPointByWardAndDis(wardName, districtName);
        if (report) {
            res.status(200).json(report);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    createPoint,
    getAllPoint,
    getPointById,
    deletePoint,
    updatePoint,
    getPointByDis,
    getPointByWardAndDis
};
