const express = require("express");
const router = express.Router();


router.get('/:id', (req, res) => {
    //param trả về panelId
    //console.log(req.query); sẽ trả về kinh độ vĩ độ
    res.render('report')
})

router.post('/:id', (req, res) => {
    console.log(req.body);
})
module.exports = router;