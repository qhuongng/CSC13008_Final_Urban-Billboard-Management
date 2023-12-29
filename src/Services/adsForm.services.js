const AdsForm = require("../Models/AdsForm")

const createForm = (newForm)=>{
    return new Promise(async(resolve, reject)=>{
        const {formId, formName}  = newForm
        try{
            const checkForm = await AdsForm.findOne({
                formId: formId
            })

            if(checkForm!==null){
                reject({
                    status: 'ERR',
                    message: 'The AdsForm is already'
                })
            }

            if(checkForm===null){
                const newForm = await AdsForm.create({
                    formId, 
                    formName
                })
                if(newForm){
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: newForm
                    })
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

const getAdsFormName = (adsFormId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkForm = await AdsForm.findOne({
                formId: adsFormId
            })
            if(checkForm==null){
                reject({
                    status: 'ERR',
                    message: 'The adsFormId not found'
                })
            }
            else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: checkForm.formName
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createForm,getAdsFormName
}