const Panel = require("../Models/Panel");

const createPanel = (newPanel)=>{
    return new Promise(async(resolve, reject)=>{
        const {idPanel, Paneltype, amount, size, picturePanel, expDate} = newPanel
        console.log(newPanel)
        try{
            const checkPanel = await Panel.findOne({
                idPanel: idPanel,
            });

            if(checkPanel!==null){
                reject({
                    status: 'ERR',
                    message: 'The Panel is already'
                })
            }

            if(checkPanel === null){

                const newPanelData = {
                    idPanel, 
                    Paneltype, 
                    amount, 
                    size, 
                    picturePanel, 
                    expDate
                };

                const newPanel = await Panel.create(newPanelData);

                if (newPanel) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: newPanel
                    });
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

const getAllPanel = ()=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const allPanel = await Panel.find();
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allPanel

            })
        }catch(e){
            reject(e)
        }
    })
}

const getDetailsPanel = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const panel = await Panel.findOne({
                idPanel: id
            })
            if(panel === null){
                resolve({
                    status: 'OK',
                    message: 'The panel is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: panel
            })
        }catch(e){
            reject(e)
        }
    })
}

const updatePanel = (id, data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkPanel = await Panel.findOne({
                idPanel: id
            })
            if(checkPanel === null){
                resolve({
                    status: 'OK',
                    message: 'The Panel is not defined'
                })
            }
           const updatedPanel = await Panel.findOneAndUpdate({ idPanel: id }, { $set: data }, { new: true })
            resolve({
                status: 'OK',
                message: 'Update Panel success',
                data: updatedPanel
            })
        }catch(e){
            reject(e)
        }
    })
}

const deletePanel = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkPanel = await Panel.findOne({
                idPanel: id
            })
            if(checkPanel === null){
                resolve({
                    status: 'OK',
                    message: 'The Panel is not defined'
                })
            }
            await Panel.findOneAndDelete({ idPanel: id })
            resolve({
                status: 'OK',
                message: 'Delete Panel success',
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createPanel,
    getAllPanel,
    getDetailsPanel,
    updatePanel,
    deletePanel
}