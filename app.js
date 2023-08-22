//imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const port = process.env.PORT;
const pageNotFound = require("./middleware/pageNotFound");
const errorHandler = require("./middleware/errorHandler");
const user = require("./routers/user");
const africa = require("./routers/africa");
const auth = require("./middleware/authentication");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const cooperativer_router = require("./routers/cooperativeRouter");
const userLogin_router = require("./routers/userLoginRouter")
//const ejs = require("ejs");


app.set("view engine", "ejs")







//Middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5174",
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//setting the picture route
app.use("/upload", express.static("/upload"));



app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/cooperative", auth,cooperativer_router); // auth,
app.use("/api/v1/africa",  auth,africa);
app.use("/api/v1/auth", userLogin_router);




app.get("/about", (req, res)=>{
    res.send("welcome to this API");
})




//not found
app.use(pageNotFound);
//error handler 
app.use(errorHandler)

//creating the server instance
async function starter() {
    try {
        await connectDB();
        app.listen(port, () => console.log(`Server listening on port ${port}`));
        console.log("connected to db successfully...")
    } catch (error) {
        console.log(error.message);
    }
}

starter();




















