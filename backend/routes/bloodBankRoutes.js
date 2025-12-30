const express = require("express");
const router = express.Router();

const {
  getNearbyBloodBanks
} = require("../controllers/bloodBankController");

router.get("/nearby", getNearbyBloodBanks);

module.exports = router;
