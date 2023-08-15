//importing routes
const { registration, login, logout, stay_logged_in } = require("../controllers/cooperativeUser");
const { createTask, deleteTask, updateTask, getAllTask } = require("../controllers/cooperative")
const express = require("express");
const router = express.Router();

router.route("/").get(getAllTask).post(createTask);
router.route("/:id").patch(updateTask).delete(deleteTask);

router.post("/", registration);
router.post("/login_user", login);
router.post("/logout_user", logout);
router.get("/stay_logged_in", stay_logged_in);

module.exports = router;


