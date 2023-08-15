const Cooperative = require("../model/cooperative");
const { BadRequestError, ConflictError, NotAuthorized } = require("../error");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const sendMail = require("../middleware/sendMail");


const registration = async (req, res) => {
    const { username, password, email } = req.body;
    // req.body.createdBy = req.users.userID;
    if (!username || !password || !email) {
        throw new BadRequestError("username and password is required for registration purposes")
    }

    //checking for existing users
    const user = await Cooperative.findOne({ username });

    if (user) {
        throw new ConflictError("User exists, please enter another user name");
    }

    //harshing password
    const harshedPassword = await bcrypt.hash(password, 10)//ten salt round
    const newUser = new Cooperative({ username, password: harshedPassword, email, createdBy: req.users.userID });
    await newUser.save();


    //email to the new user
    const sent_from = process.env.SMTP_MAIL;
    const sent_to = newUser.email;
    const subject = `Welcome ${newUser.username}`
    const message = `
        <p>An account has been created for you by honeyland cooperative</p>
        <p> follow the link below to access your account with the following details</p>
        <p>link</p>
        <p>${newUser.username}</p>
        <p>${password}</p>
    `
    //sending the mail
    await sendMail(sent_from, sent_to, subject, message);

    //response
    //delete newUser.password;
    res.status(201).json({ msg: newUser.username });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw BadRequestError("All fields are required");
    }

    //check for users
    const user = await Cooperative.findOne({ email });
    if (!user) {
        throw ConflictError("invalid user, try again!!");
    }

    const isPassword = await bcrypt.compare(password, user.password);

    //comparing password
    if (!isPassword) {
        throw ConflictError("invalid password, try again with your correct password")
    }

    //token
    const token = JWT.sign({ user: newUser.username, userID: newUser._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    //response to user
    res.cookie(token, "user_token", { samSite: "none", secure: true }).status(201).json({ msg: newUser.user_token });
}


//stay logged in
const stay_logged_in = () => {
    //getting the token from  the user
    const authheaders = req.headers.authorization;
    //confirming token
    if (!authheaders || !authheaders.startsWith("Bearer")) {
        throw new NotAuthorized("Not authorized to access this route");
    }

    const token = authheaders.split(" ")[1];
    try {
        if (token) {
            const decoded = JWT.verify(token, JWT_SECRET);
            res.status(200).json({ decoded });
        }
    } catch (error) {
        throw new NotAuthorized(`Not authorized to access this route\n${error.message}`);
    }
}

//logout route
const logout = () => {
    return res.cookie("user_token", "").json(true);
}

module.exports = {
    registration,
    login,
    stay_logged_in,
    logout
}
