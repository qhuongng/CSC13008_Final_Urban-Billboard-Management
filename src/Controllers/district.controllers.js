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

module.exports = {
    createDistrict
}