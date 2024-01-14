const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('StatisticsWardDis/infWard');
});

module.exports = router;