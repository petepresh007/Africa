const {login, stay_logged_in, logout, getSingleUserWithoutAuth} = require("../controllers/cooperativeUser")
const express = require("express");
const router = express.Router();

router.get("/getsingle/:id", getSingleUserWithoutAuth);
router.post("/login_user",login);
router.get("/stay_logged_in",stay_logged_in );
router.post("/logout_user", logout);

module.exports = router;