const express = require("express");
const router = express.Router();
const { getArtistInfo } = require("../controllers/spotify.controller");

router.get("/artists", getArtistInfo);

module.exports = router;
