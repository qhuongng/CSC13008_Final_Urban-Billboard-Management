const ReportTypeService = require('../Services/reportType.services')

const createTypeReport= async(req,res)=>{
    try{
        const {reportId, reportName} = req.body

        if(!reportId || !reportName ){
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ReportTypeService.createTypeReport(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllReportType = async (req, res) => {
    try {
        const response = await ReportTypeService.getAllReportType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createTypeReport,
    getAllReportType
}