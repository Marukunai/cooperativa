const { Router } = require("express");
const { getNovedades } = require("../controllers/novedades.controller");

const router = Router();

router.get("/", getNovedades);

module.exports = router;