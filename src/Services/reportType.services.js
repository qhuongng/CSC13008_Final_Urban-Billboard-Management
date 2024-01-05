const ReportType = require("../Models/ReportType")

const createTypeReport = (newType)=>{
    return new Promise(async(resolve, reject)=>{
        const {reportId, reportName}  = newType
        try{
            const checkType = await ReportType.findOne({
                reportId: reportId
            })

            if(checkType!==null){
                reject({
                    status: 'ERR',
                    message: 'The Report Type is already'
                })
            }

            if(checkType===null){
                const newTypeReport = await ReportType.create({
                    reportId, 
                    reportName
                })
                if(newTypeReport){
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: newTypeReport
                    })
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

const getReportTypeName = (reportId) => {
    return new Promise(async(resolve, reject) => {
        try {
            const checkReportType = await PositionType.findOne({
                reportId: reportId
            })
            if(checkReportType==null){
                reject({
                    status: 'ERR',
                    message: 'The Report Type not found'
                })
            }
            else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: checkReportType.reportName
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    createTypeReport,getReportTypeName
}