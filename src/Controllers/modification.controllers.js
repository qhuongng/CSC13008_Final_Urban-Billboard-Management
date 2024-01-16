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


module.exports = {
    createModification,
    getAllModification,
    updateState
}