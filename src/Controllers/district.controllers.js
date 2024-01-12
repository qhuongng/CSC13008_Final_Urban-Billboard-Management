const DistrictService = require('../Services/district.services')

const createDistrict = async (req, res) => {
    try {
        const response = await DistrictService.createDistrict(req.body)
        if (response.status === "ERR") {
            return res.status(205).json(response)
        } else {
            return res.status(200).json(response)
        }
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateDistrict = async (req, res) => {
    try {
        const districtId = req.params.id
        const districtName = req.body.disName
        const response = await DistrictService.updateDistrict(districtId, districtName)
        if (response.status === "ERR") {
            return res.status(205).json(response)
        } else {
            return res.status(200).json(response)
        }
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDistrict = async (req, res) => {
    try {
        districtId = req.params.id
        const response = await DistrictService.deleteDistrict(districtId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllDis = async (req, res) => {
    try {
        const response = await DistrictService.getAllDis()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createDistrict,
    updateDistrict,
    deleteDistrict,
    getAllDis
}