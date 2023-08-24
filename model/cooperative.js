const mongoose = require("mongoose");

const CooperativeShema = new mongoose.Schema(
  {
    //user registration section
    username: {
      type: String,
      min: 3,
    },
    password: {
      type: String,
      min: 8,
    },
    email: {
      type: String,
      unique: true,
    },

    //user fund section
    available_balance: {
      type: Number,
      min: 3000,
    },
    monthly_saving: {
      type: Number,
    },

    loan_amount: {
      type: Number,
    },
    loan_balance: {
      type: Number,
    },
    monthly_deduction: {
      type: Number,
    },
    total_loan_paid: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: [true, "a user is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cooperative", CooperativeShema);
