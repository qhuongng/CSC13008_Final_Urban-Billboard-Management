const PanelType = require("../Models/PanelType")

const createTypePan = (panName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPanelType = await PanelType.findOne({
                panName: panName
            })

            if (checkPanelType !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The panel type is already'
                })
            }

            if (checkPanelType === null) {
                const idBefore = (await PanelType.findOne({}).sort({ panId: -1 })).panId;
                const count = parseInt(idBefore.slice(1), 10);
                let id;
                if (count < 10) {
                    id = "0" + (count + 1).toString();
                } else {
                    id = (count + 1).toString();
                }
                const panId = "A" + id;
                const newPanelType = await PanelType.create({
                    panId: panId,
                    panName: panName
                })
                if (newPanelType) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: newPanelType
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getPanelTypeName = (panId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPanelType = await PanelType.findOne({
                panId: panId
            })
            if (checkPanelType == null) {
                reject({
                    status: 'ERR',
                    message: 'The panition not found'
                })
            }
            else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: checkPanelType.panName
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

const getAllPanelType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allPanelType = await PanelType.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allPanelType

            })
        } catch (e) {
            reject(e)
        }
    })
}

const updatePanelType = (panId, panName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatepanel = await PanelType.findOne({
                panName: panName
            })
            if (updatepanel !== null) {
                resolve({
                    status: "ERR",
                    message: "PanelType Name is already"
                })
            } else {
                const update = await PanelType.findOneAndUpdate(
                    { panId: panId },
                    { panName: panName },
                    { new: true }
                )
                resolve({
                    status: "OK",
                    message: "update compeleted"
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

const deletePanelType = (panId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await PanelType.findOneAndDelete({ panId: panId })
            resolve({
                status: "OK",
                message: "delete complete"
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createTypePan,
    getPanelTypeName,
    getAllPanelType,
    updatePanelType,
    deletePanelType
}