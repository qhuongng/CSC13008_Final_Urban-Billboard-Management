const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Controls/wardDistrict');
});

router.get('/addDistrict', (req, res) => {
    res.render('Controls/addDistrict');
});

router.get('/addWard', (req, res) => {
    res.render('Controls/addWard', {
        districtId: req.query.districtId
    });
});

router.get('/editDistrict', (req, res) => {
    res.render('Controls/editDistrict', {
        districtId: req.query.districtId,
        districtName: req.query.districtName
    });
});

router.get('/editWard', (req, res) => {
    res.render('Controls/editWard', {
        wardId: req.query.wardId,
        wardName: req.query.wardName,
        districtRefId: req.query.districtRefId
    });
});


module.exports = router;