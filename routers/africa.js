const express = require("express");
const router = express.Router();
const { getAllTask, getSingleTask, createTask, updateTask, deleteTask, upload } = require("../controllers/africa");
const uploadFile = require("express-fileupload");



router.route("/").get(getAllTask).post(createTask);
router.route("/:id").get(getSingleTask).patch(updateTask).delete(deleteTask);

//photo route
router.post("/upload", uploadFile({ createParentPath: true }), upload);

module.exports = router;
