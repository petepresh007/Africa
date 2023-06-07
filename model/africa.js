const mongoose = require("mongoose");

const africaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "please enter a user"]
    },
    body: {
        type: String,
        required: [true, "enter a body"]
    },
    image: [String],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: [true, "a user is required"]
    }
}, { timestamps: true })


module.exports = mongoose.model("Africa", africaSchema);
