const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/report.controllers");
const multer = require('multer');

// router.get("/", reportController.showReport);
// router.get("/showReport", reportController.showReport);
//--------------------------
router.get('/getAllReport', reportController.getAllReport);
router.get('/:id', reportController.showReport);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:id', upload.array('image', 2), reportController.createReport);
//đường dẫn để xem 1 file ảnh: /img/filepath

module.exports = router;

