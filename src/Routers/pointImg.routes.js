const express = require('express');
const router = express.Router()
const pointImgController = require('../Controllers/pointImg.controllers');
//lưu tạm
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/getImgPoint/:id', pointImgController.getImgPoint);
router.post('/uploadFile', upload.single('image'), pointImgController.upImgPoint)
module.exports = router