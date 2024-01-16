const express = require('express');
const router = express.Router()
const modificationController = require('../Controllers/modification.controllers')

router.post('/createModification', modificationController.createModification);
router.get('/getAllModification', modificationController.getAllModification);
router.put('/updateState', modificationController.updateState);
router.get('/', (req, res) => {
    res.render('viewModification/modificationForm', { point: req.query.point, panel: req.query.panel })
})

router.get('/getModificationByWardDis/:wardName/:districtName', modificationController.getModificationByWardDis)
router.get('/getModificationByDis/:districtName', modificationController.getModificationByDis)
router.delete('/deleteModification/:id', modificationController.deleteModification);
router.put('/updateModification/:id', modificationController.updateModification);

module.exports = router