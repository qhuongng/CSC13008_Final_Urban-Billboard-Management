const Report = require('../Models/Report');
const reportTypeService = require('./reportType.services');

const createReport = (idPanel, locate, newReport, imgId) => {
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
                reportPicture: imgId,
                state: 0,
                actionHandler: "Chưa xử lí"
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
const getAllReport = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const report = await Report.find();
            if (!report) {
                reject({
                    status: 'ERR',
                    message: 'listReport is empty'
                })
            }
            const reportList = await Promise.all(
                report.map(async (rp) => {
                    const newRp = { ...rp.toObject() };
                    newRp.reportType = (await reportTypeService.getReportTypeName(newRp.reportType)).data;
                    return newRp
                })
            )
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: reportList

            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateAction = (reportId, state, action) => {
    return new Promise(async (resolve, reject) => {
        try {
            const thisReport = await Report.findById(reportId);
            if (!thisReport) {
                reject({
                    status: 'ERR',
                    message: 'reportId does not exist'
                })
            }
            thisReport.state = state
            thisReport.actionHandler = action
            await thisReport.save();
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    createReport,
    getAllReport
}