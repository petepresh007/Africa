const express = require("express");
const router = express.Router();
const { registration, login, profile, logoutUser, forgetPassword, reset_password, reset_password_post } = require("../controllers/user");
const upload = require("../multer");

router.post("/registration", upload.single("file"), registration);
router.post("/login", login);
router.get("/profile", profile);
router.post("/logout", logoutUser);
router.post("/forget-password", forgetPassword)
router.get("/reset-password/:id/:token", reset_password);
router.post("/reset-password/:id/:token", reset_password_post);


module.exports = router;

