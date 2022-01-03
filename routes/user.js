const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/my-addresses', (req, res) => res.render('user/MyAddresses'));
module.exports = router;