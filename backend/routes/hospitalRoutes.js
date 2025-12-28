const express = require("express");
const router = express.Router();
const hospitalController = require("../controllers/hospitalController");

router.get("/:id", hospitalController.getHospitalById);

module.exports = router;
