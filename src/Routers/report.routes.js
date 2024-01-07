const express = require("express");
const router = express.Router();
const reportImg = require('../Models/Image.js')
const multer = require('multer')
const Report = require('../Models/Report.js')


router.get('/:id', (req, res) => {
    res.render("report", { address: req.query.address, id: req.params.id, lng: req.query.lng, lat: req.query.lat });
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/:id', upload.array('image', 2), async (req, res) => {
    try {
        //lưu trên DB
        const files = req.files.map(file => {
            return {
                data: file.buffer,
                contentType: file.mimetype,
            }
        })
        const savedFile = await reportImg.create(files);
        //lưu report trên mongo
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
                message: "The locate is required",
            });
        }
        const { reportType, name, email, phone, content } = req.body
        if (!reportType || !name || !email || !phone || !content) {
            return res.status(404).json({
                status: "ERR",
                message: "The input is required",
            });
        }
        const imgId = savedFile.map(file => file._id);

        const createReport = await Report.create({
            idPanel: panelId,
            locate: locate,
            reportType: reportType,
            name: name,
            email: email,
            phone: phone,
            content: content,
            reportPicture: imgId,
            state: 0,
            actionHandler: "Chưa xử lí"
        })
        if (createReport) {
            res.status(200).json(createReport);
        }
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
})


module.exports = router;
