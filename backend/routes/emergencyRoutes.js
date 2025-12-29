const express = require("express");
const router = express.Router();
const emergencyController = require("../controllers/emergencyController");



router.post("/emergency/create", emergencyController.createEmergency);

module.exports = router;


