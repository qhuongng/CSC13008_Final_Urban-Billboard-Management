const WardService = require('../Services/ward.services')

const createWard= async(req,res)=>{
    try{
        const {wardId, wardName, districtRefId} = req.body
        if(!wardId || !wardName || !districtRefId){
            return res.status(200).json({
                status: 'ERR',
                messgae: 'The input is required'
            })
        }
        const response = await WardService.createWard(req.body)
        return res.status(200).json(response)
    }catch(e){
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

module.exports = {
    createWard,
    updateWard,
    deleteWard
}