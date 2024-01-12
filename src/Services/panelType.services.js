const PanelType = require("../Models/PanelType")

const createTypePan = (newPanelType)=>{
    return new Promise(async(resolve, reject)=>{
        const {panId, panName}  = newPanelType
        try{
            const checkPanelType = await PanelType.findOne({
                panId: panId
            })

            if(checkPanelType!==null){
                reject({
                    status: 'ERR',
                    message: 'The panel type is already'
                })
            }

            if(checkPanelType===null){
                const newPanelType = await PanelType.create({
                    panId, 
                    panName
                })
                if(newPanelType){
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: newPanelType
                    })
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

const getPanelTypeName = (panId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkPanelType = await PanelType.findOne({
                panId: panId
            })
            if(checkPanelType==null){
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

module.exports = {
    createTypePan,
    getPanelTypeName,
    getAllPanelType
}