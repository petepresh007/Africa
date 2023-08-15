const { BadRequestError } = require("../error");
const Cooperative = require("../model/cooperative");
const sendMail = require("../middleware/sendMail");
const bcrypt = require("bcrypt");

const getAllTask = async (req, res) => {
    const funds = await Cooperative.find({ createdBy: req.users.userID });
    if (!funds) {
        return res.status(404).json({ success: false, msg: "fund not found" });
    }
    res.status(200).json({ msg: { data: funds, user: req.users.users } });
}

const createTask = async (req, res) => {
    const { username, password, email, available_balance, monthly_saving, loan_amount, loan_balance, monthly_deduction } = req.body;

    if (!username || !password || !email || !monthly_saving || !loan_amount || !loan_balance || !monthly_deduction) {
        throw new BadRequestError("All fields are required..");
    }

    //start
    //checking for existing users
    const user = await Cooperative.findOne({ username });

    if (user) {
        throw new ConflictError("User exists, please enter another user name");
    }

    //harshing password
    const harshedPassword = await bcrypt.hash(password, 10)//ten salt rounds
    //end

    //incrementing the monthly savings

    const newUser = new Cooperative({ username, password: harshedPassword, email, available_balance, monthly_saving, loan_amount, loan_balance, monthly_deduction, createdBy: req.users.userID })
    await newUser.save();


    //start
    //email to the new user
    const sent_from = process.env.SMTP_MAIL;
    const sent_to = newUser.email;
    const subject = `Welcome ${newUser.username}`
    const message = `
        <p>An account has been created for you by honeyland cooperative</p>
        <p> follow the link below to access your account with the following details</p>
        <p>link</p>
        <p>Name: ${newUser.username}</p>
        <p>Password: ${password}</p>
    `
    //sending the mail
    await sendMail(sent_from, sent_to, subject, message);
    //end

    //sending the data
    res.status(201).json({ newUser });

}

const updateTask = async (req, res) => {
    let count = 0;

    const { users: { userID }, params: { id: fundID } } = req;
    const { available_balance, monthly_saving, loan_amount, loan_balance, monthly_deduction, } = req.body;
    /**finding the user and updating the users account with the current task */

    const user = await Cooperative.find({ createdBy: req.users.userID });
    let monthly = user.map((data) => {
        const { available_balance } = data;
        return available_balance;
    })
    //console.log(monthly[0]);
    let balance = monthly[0] + available_balance;
    count += balance;


    const updatedUser = { available_balance: balance, monthly_saving, loan_amount, loan_balance, monthly_deduction };
    /**console.log(updatedUser);*/

    const task = await Cooperative.findOneAndUpdate({
        createdBy: userID, _id: fundID
    }, updatedUser);

    if (task) {
        return res.status(200).json({ msg: `${task._id} has been updated` })
    }
    res.status(404).json({ msg: "fund not found" })
}

const deleteTask = async (req, res) => {
    const { users: { userID }, params: { id: fundID } } = req;

    const task = await Cooperative.findOneAndRemove({
        createdBy: userID,
        _id: fundID,
    });

    //response to the user
    if (task) {
        return res.status(200).json({ msg: `${task._id}  has been removed` })
    }
    res.status(404).json({ msg: `fund not found` })
}

//export module 
module.exports = { getAllTask, createTask, updateTask, deleteTask };