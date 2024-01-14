const express = require("express");
const router = express.Router();

router.get('/:id', (req, res) => {
    res.render('viewUser/profile');
});

module.exports = router;