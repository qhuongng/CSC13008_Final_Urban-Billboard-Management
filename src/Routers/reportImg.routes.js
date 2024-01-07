const express = require('express');
const router = express.Router()
const reportImgController = require('../Controllers/reportImg.controllers');

router.get('/getImgReport/:id', reportImgController.getImgReport);

module.exports = router