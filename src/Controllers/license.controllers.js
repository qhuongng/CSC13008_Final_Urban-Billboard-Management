const licenseServices = require('../Services/license.services')
const licenseImgServices = require('../Services/licenseImg.services')

const createLicense = async (req, res) => {
    try {

        const file = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }
        const savedFile = (await licenseImgServices.sendLicenseImg(file)).data;
        const imageId = savedFile._id;
        const { idPoint, idPanel, content, companyName, companyEmail, companyPhone, startDay, endDay } = req.body;
        console.log(req.body);
        const response = await licenseServices.createLicense(idPoint, idPanel, content, imageId, companyName, companyEmail, companyPhone, startDay, endDay);
        if (response.status === "OK") {
            res.status(200).json(response)
        }
    } catch (error) {
        return res.status(404).json({
            message: error
        });
    }
}

const getAllLicense = async (req, res) => {
    try {
        const listLicense = await licenseServices.getAllLicense();
        res.status(200).json(listLicense);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

const getAcceptedLicenseByIdPanel = async (req, res) => {
    try {
        const idPanel = req.body.idPanel
        const listLicense = await licenseServices.getAcceptedLicenseByIdPanel(idPanel);
        res.status(200).json(listLicense);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

const updateAccept = async (req, res) => {
    try {
        const { idLicense, accept } = req.body
        const response = await licenseServices.updateAccept(idLicense, accept);
        res.status(200).json(response);
    } catch (error) {
        return res.status(404).json({
            message: e
        });
    }
}

module.exports = {
    createLicense,
    getAllLicense,
    getAcceptedLicenseByIdPanel,
    updateAccept
}