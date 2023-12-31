const Panel = require("../Models/Panel");
const Point = require("../Models/Point");

const createPanel = (newPanel)=>{
    return new Promise(async(resolve, reject)=>{
        const {idPoint, Paneltype, amount, size, picturePanel, expDate} = newPanel
        try{
            const checkPoint = await Point.findOne({
                _id: idPoint
            });
            if(checkPoint === null){
                reject({
                    status: 'ERR',
                    message: 'The Point is not already'
                })
            }
            if(checkPoint !== null && checkPoint.isZoning === false){
                reject({
                    status: 'ERR',
                    message: 'The Point is not zoning'
                })
            }
            console.log(123);
            if(checkPoint !== null){
                const newPanelData = {
                    idPoint, 
                    Paneltype, 
                    amount, 
                    size, 
                    picturePanel, 
                    expDate
                };
                const newPanel = await Panel.create(newPanelData);
                console.log(newPanel);
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
            // const CheckPoint = await Point.findOne({
            //     _id : new ObjectId(id)
            // })
            // console.log(CheckPoint);
            // if(CheckPoint === null){
            //     resolve({
            //         status: 'ERR',
            //         message: 'The point is not defined'
            //     })
            // }
            const listPanel = await Panel.find({
                idPoint : id
            })
            console.log(1);
            console.log(listPanel);
            if(listPanel === null){
                resolve({
                    status: 'OK',
                    message: 'The point contains no panels'
                })                
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: listPanel
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
                _id: id
            })
            if(checkPanel === null){
                resolve({
                    status: 'OK',
                    message: 'The Panel is not defined'
                })
            }
           const updatedPanel = await Panel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
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
                _id : id
            })
            if(checkPanel === null){
                resolve({
                    status: 'OK',
                    message: 'The Panel is not defined'
                })
            }
            await Panel.findOneAndDelete({ _id: id })
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