const PanelService = require('../Services/panel.services')

const createPanel = async (req, res) => {
    try {
        const { idPoint, Paneltype, amount, size } = req.body
        //isService: {type: Boolean, default: false, require: true},

        if (!idPoint || !Paneltype || !amount || !size) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await PanelService.createPanel(req.body)
        console.log(response);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPanel = async (req, res) => {
    try {
        const response = await PanelService.getAllPanel()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getListPanel = async (req, res) => {
    try {
        const idPoint = req.params.id
        //const token = req.headers
        if (!idPoint) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The pointId is required'
            })
        }
        const response = await PanelService.getDetailsPanel(idPoint)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deletePanel = async (req, res) => {
    try {
        const panelId = req.params.id
        //const token = req.headers
        if (!panelId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The panelId is required'
            })
        }

        const response = await PanelService.deletePanel(panelId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updatePanel = async (req, res) => {
    try {
        const panelId = req.params.id
        const data = req.body
        if (!panelId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The panelId is required'
            })
        }

        const response = await PanelService.updatePanel(panelId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createPanel,
    getAllPanel,
    getListPanel,
    deletePanel,
    updatePanel
}