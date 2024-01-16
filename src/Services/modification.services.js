const Modification = require('../Models/Modification');
const positionTypeService = require('../Services/positionType.services');
const adsFormService = require('../Services/adsForm.services');
const panelTypeService = require('../Services/panelType.services');
const Point = require('../Models/Point');
const Panel = require('../Models/Panel');

const createModification = (newModify) => {
    return new Promise(async (resolve, reject) => {
        console.log(newModify);
        try {
            const { idPoint, idPanel, changedList, reason } = newModify
            const newModification = await Modification.create({
                idPoint: idPoint,
                idPanel: idPanel,
                changedList: changedList,
                reason: reason,
                state: 0
            })
            if (newModification) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: newModification
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllModification = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listModify = await Modification.find();
            if (listModify === null) {
                resolve({
                    status: "ERR",
                    message: "List Modification is empty"
                })
            }
            const updateList = await Promise.all(
                listModify.map(async (modify) => {
                    const newModify = { ...modify.toObject() }
                    if (newModify.idPanel === "-1") {
                        if (newModify.changedList[0] !== "-1") {
                            newModify.changedList[0].oldValue = (await positionTypeService.getPositionName(newModify.changedList[0].oldValue)).data;
                            newModify.changedList[0].newValue = (await positionTypeService.getPositionName(newModify.changedList[0].newValue)).data;
                        }
                        if (newModify.changedList[1] !== "-1") {
                            newModify.changedList[1].oldValue = (await adsFormService.getAdsFormName(newModify.changedList[1].oldValue)).data;
                            newModify.changedList[1].newValue = (await adsFormService.getAdsFormName(newModify.changedList[1].newValue)).data;
                        }
                    }
                    else {
                        if (newModify.changedList[0] !== "-1") {
                            newModify.changedList[0].oldValue = (await panelTypeService.getPanelTypeName(newModify.changedList[0].oldValue)).data;
                            newModify.changedList[0].newValue = (await panelTypeService.getPanelTypeName(newModify.changedList[0].newValue)).data;
                        }
                    }
                    return newModify;
                })
            )
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateList
            })
        } catch (error) {
            reject(error)
        }
    })
}

const updateAction = (modifyId, action) => {
    return new Promise(async (resolve, reject) => {
        try {
            const modify = await Modification.findOne({ _id: modifyId })
            if (modify) {
                if (action === -1) {
                    const updateModify = await Modification.findOneAndUpdate(
                        { _id: modifyId },
                        { state: action },
                        { new: true }
                    )
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: updateModify
                    })
                }
                if (action === 1) {
                    //chỉnh trạng thái sang chấp nhận 
                    const updateModify = await Modification.findOneAndUpdate(
                        { _id: modifyId },
                        { state: action },
                        { new: true }
                    )
                    //update dành cho point
                    if (updateModify.idPanel === "-1") {
                        for (let index = 0; index < updateModify.changedList.length; index++) {
                            if (updateModify.changedList[index] !== "-1") {
                                //update positionType
                                if (index === 0) {
                                    const updateType = await Point.findOneAndUpdate(
                                        { _id: updateModify.idPoint },
                                        { positionType: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                                //update AdsForm
                                else if (index === 1) {
                                    const updateForm = await Point.findOneAndUpdate(
                                        { _id: updateModify.idPoint },
                                        { formAdvertising: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                                //update isZoning
                                else {
                                    const updateZoning = await Point.findOneAndUpdate(
                                        { _id: updateModify.idPoint },
                                        { isZoning: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                            }
                        }
                        resolve({
                            status: "OK",
                            message: "update complete"
                        })
                    } else {
                        //for panel update
                        for (let index = 0; index < updateModify.changedList.length; index++) {
                            if (updateModify.changedList[index] !== "-1") {
                                //update PanelType
                                if (index === 0) {
                                    const updateType = await Panel.findOneAndUpdate(
                                        { _id: updateModify.idPanel },
                                        { Paneltype: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                                //update amount
                                else if (index === 1) {
                                    const updateAmount = await Panel.findOneAndUpdate(
                                        { _id: updateModify.idPanel },
                                        { amount: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                                //update isZoning
                                else {
                                    const updateSize = await Panel.findOneAndUpdate(
                                        { _id: updateModify.idPanel },
                                        { size: updateModify.changedList[index].newValue },
                                        { new: true }
                                    )
                                }
                            }
                        }
                        resolve({
                            status: "OK",
                            message: "update complete"
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createModification,
    getAllModification,
    updateAction
}