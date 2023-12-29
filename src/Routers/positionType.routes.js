const express = require('express');
const router = express.Router()
const posController = require('../Controllers/positionType.controllers');

router.post('/createTypePos', posController.createTypePos),

module.exports = router