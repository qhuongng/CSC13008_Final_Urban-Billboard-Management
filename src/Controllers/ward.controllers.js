const WardService = require('../Services/ward.services')

const createWard = async (req, res) => {
    try {
        const response = await WardService.createWard(req.body)
        if (response.status === "ERR") {
            return res.status(204).json(response)
        } else {
            return res.status(200).json(response)
        }

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateWard = async (req, res) => {
    try {
        const wardId = req.params.id
        const wardName = req.body.wardName
        const districtRefId = req.body.districtRefId
        const response = await WardService.updateWard(wardId, wardName, districtRefId)
        if (response.status === "ERR") {
            return res.status(204).json(response)
        } else {
            return res.status(200).json(response)
        }
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteWard = async (req, res) => {
    try {
        const wardId = req.params.id
        const districtRefId = req.body.districtRefId
        const response = await WardService.deleteWard(wardId, districtRefId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllWard = async (req, res) => {
    try {
        const response = await WardService.getAllWard()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailWard = async (req, res) => {
    const districtId = req.params.id;

    try {
        const response = await WardService.getWardsByDistrictId(districtId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const getWardsByDistrictName = async (req, res) => {
    const disName = req.params.name;

    try {
        const response = await WardService.getWardsByDistrictName(disName);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

const getWardById = async (req, res) => {
    const wardId = req.params.id;

    try {
        const response = await WardService.getWardById(wardId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

module.exports = {
    createWard,
    updateWard,
    deleteWard,
    getAllWard,
    getDetailWard,
    getWardsByDistrictName,
    getWardById
}