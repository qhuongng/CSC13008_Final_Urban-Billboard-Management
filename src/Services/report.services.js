const Report = require('../Models/Report');
const reportTypeService = require('./reportType.services');
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL
    }
});

const createReport = (idPanel, locate, newReport, imgId, district, ward, address) => {
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
                district: district,
                ward: ward,
                address: address,
                state: 0,
                actionHandler: "Chưa xử lí"
            })
            if (createReport) {
                const mailOptions = {
                    from: 'Admin Map Application',
                    to: createReport.email,
                    subject: 'Báo cáo đã được gửi thành công',
                    html: `
                    <h3>Xin chào ${createReport.name}</h3>
                    <p>Chúng tôi đã nhận được báo cáo của bạn. Báo cáo sẽ được xử lí và thông báo sau</p>
                    <table>
                        <tr>
                            <td><h4>Địa chỉ: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="color: yellow;"><h4>${createReport.address}</h4></td>
                        </tr>   
                        <tr>
                            <td><h4>Tình trạng xử lí: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style="color: red;"><h4>Chưa xử lí</h4></td>
                        </tr>
                        <tr>
                            <td><h4>Cách thức xử lí: </h4></td>
                            <td></td>
                            <td></td>
                            <td></td><td style="color: red;"><h4>Chưa xử lí</h4></td>
                        </tr>
                    </table>
                    `
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        reject(error)
                    }
                })
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