const DistrictService = require('../Services/district.services')

const createDistrict= async(req,res)=>{
    try{
        const {disId, disName} = req.body

        if(!disId || !disName ){
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await DistrictService.createDistrict(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateDistrict = async (req, res) => {
    try {
        const districtId = req.params.id
        const data = req.body
        if (!districtId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The DistrictId is required'
            })
        }

        const response = await DistrictService.updateDistrict(districtId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDistrict = async (req, res) => {
    try {
        const districtId = req.params.id
        //const token = req.headers
        if (!districtId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The DistrictId is required'
            })
        }

        const response = await DistrictService.deleteDistrict(districtId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllDis = async (req, res) => {
    try {
        const response = await DistrictService.getAllDis()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createDistrict,
    updateDistrict,
    deleteDistrict,
    getAllDis
}