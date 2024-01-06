const reportService = require("../Services/report.services");

const createReport = async (req, res) => {
    try {
        const panelId = req.params.id;
        if (!panelId) {
            return res.status(404).json({
                status: "ERR",
                message: "The panelId is required",
            });
        }
        const locate = [req.query.lng, req.query.lat];
        if (!locate) {
            return res.status(404).json({
                status: "ERR",
                message: "The loacte is required",
            });
        }
        const { reportType, name, email, phone, content } = req.body
        if (!reportType || !name || !email || !phone || !content) {
            return res.status(404).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const pathImg = req.files.map(file => 'img/' + file.filename);
        const report = await reportService.createReport(panelId, locate, req.body, pathImg);
        //res.status(200).json(report);
        res.redirect("/");
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getAllReport = async (req, res) => {
    try {
        const report = await reportService.getAllReport();
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const showReport = async (req, res) => {
    res.render("report", { address: req.query.address });
};

module.exports = {
    createReport,
    getAllReport,
    showReport,
};
