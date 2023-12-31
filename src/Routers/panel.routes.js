const express = require('express');
const router = express.Router()
const panelController = require('../Controllers/panel.controllers')

router.post('/uploadPanel', panelController.createPanel),
router.get('/getAllPanel', panelController.getAllPanel),
router.get('/getListPanel/:id', panelController.getListPanel),
router.delete('/deletePanel/:id', panelController.deletePanel),
router.put('/updatePanel/:id',panelController.updatePanel),

module.exports = router;
