const PanelService = require('../Services/panelType.services')

const createTypePan= async(req,res)=>{
    try{
        const {panId, panName} = req.body

        if(!panId || !panName ){
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await PanelService.createTypePan(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createTypePan
}