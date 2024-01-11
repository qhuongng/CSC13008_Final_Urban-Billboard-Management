const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Controls/wardDistrict');
});

router.get('/addDistrict', (req, res) => {
    res.render('Controls/addDistrict');
});

router.get('/addWard', (req, res) => {
    res.render('Controls/addWard');
});

router.get('/editDistrict', (req, res) => {
    res.render('Controls/editDistrict');
});

router.get('/editWard', (req, res) => {
    res.render('Controls/editWard');
});


module.exports = router;