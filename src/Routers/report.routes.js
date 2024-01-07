const express = require("express");
const router = express.Router();

router.get('/:id', (req, res) => {
    res.render("report", { address: req.query.address, id: req.params.id, lng: req.query.lng, lat: req.query.lat, district: req.query.district, ward: req.query.ward });
});

module.exports = router;
