const PointService = require("../Services/point.services");

const createPoint = async (req, res) => {
    try {
        const { _id, name, address, area, locate, positionType, formAdvertising, picturePoint, isZoning } = req.body;
        const reg = /\/d\/(.+?)\//;
        const IDPicture = picturePoint.match(reg);
        if (!_id || !name || !address || !area || !locate || !positionType || !formAdvertising || !IDPicture || isZoning == null) {
            return res.status(404).json({
                status: "ERR",
                message: "The input is required",
            });
        } else if (IDPicture == null) {
            return res.status(404).json({
                status: "ERR",
                message: "The input picture Point is not link Google Drive",
            });
        }
        req.body.picturePoint = IDPicture[1];
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
module.exports = {
    createPoint,
    getAllPoint,
    getPointById,
    deletePoint,
    updatePoint,
};
