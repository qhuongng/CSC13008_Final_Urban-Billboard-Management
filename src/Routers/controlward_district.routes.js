const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('controlWardDistrict/wardDistrict');
});

router.get('/addDistrict', (req, res) => {
    res.render('controlWardDistrict/addDistrict');
});

router.get('/addWard', (req, res) => {
    res.render('controlWardDistrict/addWard', {
        districtId: req.query.districtId
    });
});

router.get('/editDistrict', (req, res) => {
    res.render('controlWardDistrict/editDistrict', {
        districtId: req.query.districtId,
        districtName: req.query.districtName
    });
});

router.get('/editWard', (req, res) => {
    res.render('controlWardDistrict/editWard', {
        wardId: req.query.wardId,
        wardName: req.query.wardName,
        districtRefId: req.query.districtRefId
    });
});


module.exports = router;