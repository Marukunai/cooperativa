const express = require("express");
const router = express.Router();
const { getVisits } = require("../models/Visit");

router.get("/", (req, res) => {
    const visits = getVisits();
    res.json({
        total: visits.length,
        visits
    });
});

module.exports = router;