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
    const {
      username,
      email,
      password,
      available_balance,
      monthly_saving,
      loan_amount,
      loan_balance,
      monthly_deduction,
      total_loan_paid
    } = req.body;
    if (!email || !password) {
        throw new BadRequestError("All fields are required");
    }
    
    //check for users
    const user = await Cooperative.findOne({ email });
    if (!user) {
        throw new ConflictError("invalid user, try again!!");
    }

    const isPassword = await bcrypt.compare(password, user.password);

    //comparing password
    if (!isPassword) {
        throw ConflictError("invalid password, try again with your correct password")
    }

    //token
    const token = JWT.sign({ 
        user: user.username, 
        userID: user._id,
        availableBalance:available_balance,
        monthlySavings: monthly_saving,
        loanAmount: loan_amount,
        loanBalance: loan_balance,
        monthlyDeduction: monthly_deduction,
        totalLoanPaid: total_loan_paid
    }, process.env.JWT_SECRET, { expiresIn: "30d" });
    //response to user
    res.cookie(token, "user_token", { samSite: "none", secure: true }).status(200).json({ msg: user, token});
}

const getSingleUserWithoutAuth = async (req, res) => {
    const {id: id} = req.params
    const fund = await Cooperative.find({_id:id});
    console.log(fund);
    
    if (!fund) {
      return res.status(404).json({ success: false, msg: "fund not found" });
    }
    res.status(200).json({ msg: { data: fund,  } });
}

//stay logged in
const stay_logged_in = (req, res) => {
    const authHeaders = req.headers.authorization
    if(!authHeaders || !authHeaders.startsWith("Bearer")){
        throw new NotAuthorized("Not authorized to access this route");
    }
    const token = authHeaders.split(" ")[1];
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        res.status(200).json({decoded})
    } catch (error) {
        throw new NotAuthorized("Provide a valid token ");
    }
}

//logout route
const logout = (req, res) => {
    return res.cookie("user_token", "").json(true);
}

module.exports = {
    registration,
    login,
    stay_logged_in,
    logout,
    getSingleUserWithoutAuth,
}
