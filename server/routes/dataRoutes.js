const express = require("express");
const router = express.Router();
const dataRoutes = require("../controllers/dataController");

router.get("/chartdata", dataRoutes.getLogs);
router.get("/tradedata", dataRoutes.getTrades);

module.exports = router;
