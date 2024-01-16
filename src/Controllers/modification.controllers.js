const Modification = require('../Models/Modification')
const modificationServices = require('../Services/modification.services')

const createModification = async (req, res) => {
    try {
        const response = await modificationServices.createModification(req.body);
        if (response.status === "OK") res.status(200).json(response)
        else res.status(205).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllModification = async (req, res) => {
    try {
        const response = await modificationServices.getAllModification();
        if (response.status === "OK") res.status(200).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateState = async (req, res) => {
    try {
        console.log(req.body);
        const { modifyId, state } = req.body
        const response = await modificationServices.updateAction(modifyId, state);
        if (response.status === "OK") res.status(200).json(response)
        else res.status(205).json(response)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getModificationByWardDis = async (req, res) => {
    try {
        const { wardName, districtName } = req.params;
        const listModification = await modificationServices.getModificationByWardDis(wardName, districtName);
        if (listModification) {
            res.status(200).json(listModification);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const deleteModification = async (req, res) => {
    try {
        const ModificationId = req.params.id
        const response = await modificationServices.deleteModification(ModificationId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getModificationByDis = async (req, res) => {
    try {
        const districtName = req.params.districtName;
        const listModification = await modificationServices.getModificationByDis(districtName);
        if (listModification) {
            res.status(200).json(listModification);
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


const updateModification = async (req, res) => {
    try {
        const modificationId = req.params.id
        const data = req.body
        if (!modificationId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The modificationId is required'
            })
        }

        const response = await modificationServices.updateModification(modificationId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createModification,
    getAllModification,
    updateState,
    deleteModification,
    getModificationByWardDis,
    getModificationByDis,
    updateModification
}