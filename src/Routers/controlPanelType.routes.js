const express = require("express");
const router = express.Router();

// Xem danh sách - View list
router.get('/', (req, res) => {
    // Implement code to fetch and render the list view
    res.render('Controls/panelType/panelType');
});

// Xem chi tiết - View details
router.get('/:id', (req, res) => {
    // Implement code to fetch and render details based on the provided ID
    const itemId = req.params.id;
    res.render('Controls/panelType/details', { itemId });
});

// Thêm - Add
router.post('/', (req, res) => {
    // Implement code to handle the creation of a new item
    // You can access form data using req.body
    res.redirect('/'); // Redirect to the list view after adding
});

// Xoá - Delete
router.delete('/:id', (req, res) => {
    // Implement code to handle the deletion of an item based on the provided ID
    res.redirect('/'); // Redirect to the list view after deleting
});

// Cập nhật - Update
router.put('/:id', (req, res) => {
    // Implement code to handle the update of an item based on the provided ID
    res.redirect('/'); // Redirect to the list view after updating
});

// Các thao tác chuyên biệt khác - Other specialized actions
router.get('/special', (req, res) => {
    // Implement code for other specialized actions
    res.render('Controls/panelType/special');
});

module.exports = router;
