const {login, stay_logged_in, logout} = require("../controllers/cooperativeUser")
const express = require("express");
const router = express.Router();


router.post("/login_user",login);
router.get("/stay_logged_in",stay_logged_in );
router.post("/logout_user", logout);

module.exports = router;