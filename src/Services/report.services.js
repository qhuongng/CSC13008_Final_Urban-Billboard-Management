const Report = require('../Models/Report');
const ReportType = require('../Models/ReportType');

const createReport = (idPanel, locate, newReport, pathImg) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createReport = await Report.create({
                idPanel: idPanel,
                locate: locate,
                reportType: newReport.reportType,
                name: newReport.name,
                email: newReport.email,
                phone: newReport.phone,
                content: newReport.content,
                reportPicture: pathImg,
                state: 0
            })
            if (createReport) {
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
            if (showReport) {
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