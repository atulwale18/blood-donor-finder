const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.post('/create', emergencyController.createEmergencyRequest);
router.get('/active', emergencyController.getActiveRequests);
router.get('/match/:id', emergencyController.matchEmergencyDonors);


module.exports = router;
