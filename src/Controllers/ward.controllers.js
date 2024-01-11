const WardService = require('../Services/ward.services')

const createWard = async (req, res) => {
    try {
        const { wardId, wardName, districtRefId } = req.body
        if (!wardId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The wardId is required'
            })
        }
        if (!wardName) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The wardName is required'
            })
        }
        if (!districtRefId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The districtRefId is required'
            })
        }
        const response = await WardService.createWard(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateWard = async (req, res) => {
    try {
        const wardId = req.params.id
        const data = req.body
        if (!wardId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The wardId is required'
            })
        }

        const response = await WardService.updateWard(wardId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteWard = async (req, res) => {
    try {
        const wardId = req.params.id
        //const token = req.headers
        if (!wardId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The wardId is required'
            })
        }

        const response = await WardService.deleteWard(wardId)
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


module.exports = {
    createWard,
    updateWard,
    deleteWard,
    getAllWard,
    getDetailWard
}