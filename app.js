//imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/errorHandler");
const user = require("./routers/user");
const africa = require("./routers/africa");
const auth = require("./middleware/authentication");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const cooperativer_router = require("./routers/cooperativeRouter");
//const ejs = require("ejs");


app.set("view engine", "ejs")







//Middlewares
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173"
    }))
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//setting the picture route
app.use("/upload", express.static("/upload"));



app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/cooperative", auth, cooperativer_router);
app.use("/api/v1/africa", auth, africa);









//not found
app.use(pageNotFound);
//error handler 
app.use(errorHandler)

//creating the server instance
async function starter() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
        console.log("connected to db successfully...")
    } catch (error) {
        console.log(error.message);
    }
}

starter();




















