const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        min: [3, "username should not be less than 3 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "an email is required"]
    },
    password: {
        type: String,
        required: [true, "please enter a password"],
    }
}, { timestamps: true });


const UserSchema = model("User", userSchema);

module.exports = UserSchema;