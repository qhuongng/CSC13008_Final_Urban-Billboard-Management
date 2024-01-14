const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('StatisticsWardDis/infWard');
});

router.get('/1', (req, res) => {
    res.render('StatisticsWardDis/infPanel');
});


module.exports = router;