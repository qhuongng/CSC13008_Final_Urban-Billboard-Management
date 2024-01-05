const express = require('express');
const router = express.Router()
const panelController = require('../Controllers/panelType.controllers');

router.post('/createTypePan', panelController.createTypePan),

module.exports = router