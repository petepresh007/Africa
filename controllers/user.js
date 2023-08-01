//user registration and login
const { ConflictError, BadRequestError } = require("../error");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");
const sendEmail = require("../middleware/sendMail");
const { join } = require("path")


//registration
async function registration(req, res) {
    const { username, email, password } = req.body;

<<<<<<< HEAD
    if(!username || !email || !password){
=======
    if(!username || !email || !password)
    {
>>>>>>> 30bfb3f4572d83292243f3bd02dddc51daed4106
        throw new BadRequestError("All fields are required");
    }

    //checking for duplicate user
    const user = await User.findOne({ username });
    if (user) {
        throw new ConflictError("User already exists");
    }

    //hashing the password
    const encryptedPassword = await bcrypt.hash(password, 10); //10 salt round
    //handling files
    /*const filename = req.file.filename;
    const fileUrl = join(filename);*/

    const createduser = new User({ username, email, password: encryptedPassword});
    await createduser.save();

    //token
    const token = sign({ users: createduser.username, userID: createduser._id }, process.env.JWT_SECRET, { expiresIn: "30d" });



    //nodemailer - send mail
    const send_from = process.env.SMTP_MAIL;
    const sent_to = email;
<<<<<<< HEAD
    const subject = `Honeyland Cooperative`
=======
    const subject = `<h1>Welcome to Honeyland cooperaive ${createduser.username}</h1>`;
>>>>>>> 30bfb3f4572d83292243f3bd02dddc51daed4106
    const message = `
    <h2>Your username is: ${createduser.username}</h2>
    <h2>Your password is: ${password}</h2>
    <p>Make sure you don't share your login details with anybody.</p>
    `
    await sendEmail(send_from, sent_to, subject, message);

    //sending a report
    //res.status(201).json({ users: { name: createduser.username }, token });
    res.cookie("access_token", token, { sameSite: "none", secure: true }).status(201).json({ users: { name: createduser.username }, token });

}

//login
async function login(req, res) {
    //input from the users
    const { email, password } = req.body;
    if (!email || !password){
        throw new BadRequestError("All fields are required");
    }

    //checking for a user
    const users = await User.findOne({ email });
    if (!users) {
        throw new ConflictError("enter valid credentials")
    }

    //compare password
    const isPasswordOk = await bcrypt.compare(password, users.password);
    if (!isPasswordOk) {
        throw new ConflictError("enter valid credentials ")
    }

    const token = sign({ users: users.username, userID: users._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    //sending a report
    //res.status(200).json({ users: { name: users.username }, token });
    res.cookie("access_token", token, { sameSite: "none", secure: true }).status(200).json({ users: { name: users.username }, token });

}

//stay online
function profile(req, res) {
    const { access_token } = req.cookies;
    if (access_token) {
        verify(access_token, process.env.JWT_SECRET, {}, function (err, user) {
            if (err) throw err;
            res.status(200).json(user);
        })
    } else {
        res.json(null)
    }
}

//logout
const logoutUser = (req, res) => {
    return res.cookie("access_token", "").json(true);
}

//forget password

//post function
async function forgetPassword(req, res) {
    const { email } = req.body;

    //finding the old user
    const old_user = await User.findOne({ email });

    if (!old_user) {
        return res.status(404).json({ msg: `No user with the email ${email} found` })
    }

    //finding the token
    const token = sign({ users: old_user.username, userID: old_user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    //creating a link to send to the user
    const link = `http://localhost:5000/api/v1/user/reset-password/${old_user._id}/${token}`;
    console.log(link);
    res.send("Woked")

}

//reset password with :id/:token
async function reset_password(req, res) {
    const { id, token } = req.params;

    const old_user = await User.findOne({ _id: id });

    if (!old_user) {
        return res.status(404).json({ msg: `No user with the id ${id} found` });
    }

    //verify the token
    const verifiedUser = verify(token, process.env.JWT_SECRET);
    //res.status(200).json({ msg: `verified successfully` });
    //res.send("Welcome")
    res.render("index", { user: verifiedUser.users });
    // res.send("Wecome to reset")

}

//post request to reset the password
async function reset_password_post(req, res) {
    const { id, token } = req.params;
    const { password } = req.body;

    //checking for old user
    const old_user = await User.findOne({ _id: id });

    if (!old_user) {
        return res.status(404).json({ msg: `No user with the id ${id} found` });
    }

    //verify the token
    const verifiedUser = verify(token, process.env.JWT_SECRET);

    //harshed password
    const newP = password.toString() //converting the password to string
    const harshedPassword = await bcrypt.hash(newP, 10);

    //changing the password
    await User.updateOne(
        {
            _id: id
        },
        {
            $set: {
                password: harshedPassword
            }
        }
    );

    res.status(200).json({ msg: "Password updated successfully..." })
}


module.exports = { registration, login, profile, logoutUser, forgetPassword, reset_password, reset_password_post }