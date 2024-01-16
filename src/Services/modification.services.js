const Modification = require('../Models/Modification');
const positionTypeService = require('../Services/positionType.services');
const adsFormService = require('../Services/adsForm.services');
const panelTypeService = require('../Services/panelType.services');
const Point = require('../Models/Point');
const Panel = require('../Models/Panel');
const User = require('../Models/Users');
const Ward = require("../Models/Ward");
const District = require("../Models/District");
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL
    }
});

const createModification = (newModify) => {
    return new Promise(async (resolve, reject) => {
        console.log(newModify);
        try {
            const { idPoint, idPanel, changedList, reason, idUser } = newModify
            const newModification = await Modification.create({
                idPoint: idPoint,
                idPanel: idPanel,
                changedList: changedList,
                reason: reason,
                idUser: idUser,
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

const mailOptions = async (idUser, status, idPoint) => {
    const user = await User.findOne({ _id: idUser });
    const point = await Point.findOne({ _id: idPoint });
    let temp, color
    if (status === 1) { temp = "Được chấp nhận", color = "green" }
    else { temp = "Bị từ chối", color = "red" }
    const successEmail = {
        from: 'Admin Map Application',
        to: user.email,
        subject: 'Yêu cầu chỉnh sửa đã được xử lí',
        html: `
        <h3>Xin chào ${user.name}</h3>
        <p>Yêu cầu chỉnh sửa của bạn đã được xem xét và xử lí bởi cán bộ sở</p>
        <br>
        <p>Thông tin yêu cầu chỉnh sửa: </p>
        <table>
            <tr>
                <td><h4>Địa chỉ: </h4></td>
                <td></td>
                <td></td>
                <td></td>
                <td><h4>${point.address}</h4></td>
            </tr>   
            <tr>
                <td><h4>Kết quả: </h4></td>
                <td></td>
                <td></td>
                <td></td>
                <td style="color: ${color};"><h4>${temp}</h4></td>
            </tr>
        </table>
        <p>Cảm ơn bạn đã gửi yêu cầu chỉnh sửa về sở Văn hóa và Thông tin.</p>
        `
    }
    return successEmail
};
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
                    const mail = await mailOptions(modify.idUser, action, modify.idPoint)
                    transporter.sendMail(mail, (error, info) => {
                        if (error) {
                            console.log(error);
                            reject(error)
                        }
                    })
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
                        const mail = await mailOptions(modify.idUser, action, modify.idPoint)
                        transporter.sendMail(mail, (error, info) => {
                            if (error) {
                                console.log(error);
                                reject(error)
                            }
                        })
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
                        const mail = await mailOptions(modify.idUser, action, modify.idPoint)
                        transporter.sendMail(mail, (error, info) => {
                            if (error) {
                                console.log(error);
                                reject(error)
                            }
                        })
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

const getModificationByWardDis = (wardName, districtName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ward = await Ward.findOne({ wardName: wardName });
            if (!ward) {
                reject({
                    status: 'ERR',
                    message: 'Ward is undefined'
                });
                return;
            }

            const district = await District.findOne({ disName: districtName });
            if (!district) {
                reject({
                    status: 'ERR',
                    message: 'District is undefined'
                });
                return;
            }

            const points = await Point.find({
                'area.ward': ward.wardId,
                'area.district': district.disId
            });

            if (points.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'No points found for the specified ward and district'
                });
                return;
            }

            const modifications = await Modification.find({ idPoint: { $in: points.map(point => point._id) } });

            if (modifications.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'No modifications found for the specified points'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: modifications
            });

        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Error in processing',
                error: error
            });
        }
    });
};


const deleteModification = (ModificationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Modification.findOneAndDelete({
                _id: ModificationId
            });
            resolve({
                status: 'OK',
                message: 'Delete Modification success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getModificationByDis = (districtName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const district = await District.findOne({ disName: districtName });
            if (!district) {
                reject({
                    status: 'ERR',
                    message: 'District is undefined'
                });
                return;
            }

            const points = await Point.find({
                'area.district': district.disId
            });

            if (points.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'No points found for the specified ward and district'
                });
                return;
            }

            const modifications = await Modification.find({ idPoint: { $in: points.map(point => point._id) } });

            if (modifications.length === 0) {
                reject({
                    status: 'ERR',
                    message: 'No modifications found for the specified points'
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: modifications
            });

        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Error in processing',
                error: error
            });
        }
    });
};

const updateModification = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkModification = await Modification.findOne({
                _id: id
            })
            if (checkModification === null) {
                reject('The Modification is not defined');
            }
            const updatedMod = await Modification.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Update Modification success',
                data: updatedMod
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createModification,
    getAllModification,
    updateAction,
    deleteModification,
    getModificationByWardDis,
    getModificationByDis,
    updateModification
}