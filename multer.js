const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "upload")
    },
    filename: function (req, file, callback) {
        const pictureCode = Date.now() + "-" + Math.floor(Math.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        callback(null, filename + "-" + pictureCode + ".png");
    }
});


const uploads = multer({ storage: storage });
module.exports = uploads