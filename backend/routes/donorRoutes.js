const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

router.post('/match', donorController.findDonors);

module.exports = router;
