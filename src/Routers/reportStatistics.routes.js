const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Statistics/infReport');
});

module.exports = router;