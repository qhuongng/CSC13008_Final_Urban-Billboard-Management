const express = require("express");
const router = express.Router();

const reportController = require("../Controllers/report.controllers");

router.post("/createReport", reportController.createReport);
router.get("/getNewReport", reportController.getNewReport);
router.get("/", reportController.showReport);
router.get("/showReport", reportController.showReport);
//---------------------------
router.get('/:id', (req, res) => {
    //param trả về panelId
    //console.log(req.query); sẽ trả về kinh độ vĩ độ
    res.render('report')
})

router.post('/:id', (req, res) => {
    console.log(req.body);
})
module.exports = router;

