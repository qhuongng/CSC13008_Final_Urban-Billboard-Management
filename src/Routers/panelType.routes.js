const express = require('express');
const router = express.Router()
const panelController = require('../Controllers/panelType.controllers');

router.post('/createTypePanel', panelController.createTypePanel);
router.get('/getAllPanelType', panelController.getAllPanelType);
router.put('/updateTypePanel', panelController.updatePanelType);
router.delete('/deleteTypePanel', panelController.deletePanelType);

module.exports = router