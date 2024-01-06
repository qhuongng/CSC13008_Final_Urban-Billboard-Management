const Report = require('../Models/Report');
const ReportType = require('../Models/ReportType');

const createReport = (newReport) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getIdType = await ReportType.findOne({
                reportName : newReport.reportName
            })
            if(getIdType == null){
                reject({
                    status: "ERR",
                    message: "Report Type not found",
                })
            }
            const reportType = getIdType.reportType
            const createReport = await Report.create({
                idPanel: newReport.idPanel || null,
                locate: newReport.locate,
                reportType: reportType,
                name: newReport.name,
                email: newReport.email,
                phone: newReport.phone,
                content: newReport.content,
                reportPicture: newReport.reportPicture,
                state: 0
            })
            if(createReport){
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createReport
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

// const getNewReport = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const getNewReport = await Report.find({
//                 state: 0
//             })
//             if(getNewReport){
//                 resolve({
//                     status: "OK",
//                     message: "SUCCESS",
//                     data: getNewReport
//                 })
//             }
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const getAllReport = () => {
//     return new Promise(async (resolve, reject) => {
//         try {
            
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

const showReport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const showReport = await Report.find({
                state: 0
            })
            if(showReport){
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: showReport
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createReport,
    showReport
}