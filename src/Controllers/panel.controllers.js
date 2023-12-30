const PanelService = require('../Services/panel.services')

const createPanel= async(req,res)=>{
    try{
        const {idPanel, Paneltype, amount, size, picturePanel, expDate} = req.body
        //isService: {type: Boolean, default: false, require: true},
        const reg =  /\/d\/(.+?)\//;   
        const IDPicture = picturePanel.match(reg);
        if(!idPanel || !Paneltype || !amount || !size|| !IDPicture || !expDate){
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(IDPicture == null) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input picture Panel is not link Google Drive'
            })
        }
        req.body.picturePanel = IDPicture[1]
        const response = await PanelService.createPanel(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPanel = async(req,res)=>{
    try{
        const response = await PanelService.getAllPanel()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsPanel = async(req,res)=>{
    try{
        const idPanel = req.params.id
        //const token = req.headers
        if(!idPanel){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The panelId is required'
            })
        }

        const response = await PanelService.getDetailsPanel(idPanel)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deletePanel = async(req,res)=>{
    try{
        const panelId = req.params.id
        //const token = req.headers
        if(!panelId){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The panelId is required'
            })
        }

        const response = await PanelService.deletePanel(panelId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updatePanel = async(req,res)=>{
    try{
        const panelId = req.params.id
        const data = req.body
        if(!panelId){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The panelId is required'
            })
        }

        const response = await PanelService.updatePanel(panelId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createPanel,
    getAllPanel,
    getDetailsPanel,
    deletePanel,
    updatePanel
}