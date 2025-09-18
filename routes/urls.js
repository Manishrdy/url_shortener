// routes/urls.js
const express = require('express');
const router = express.Router();
const { createUrl } = require('../controllers/urlController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createUrl);

module.exports = router;
