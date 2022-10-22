const express =  require('express');
const app = express(); //INFO: how to create a web application.
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cryptojs = require('crypto-js');

//INFO: app.set or examples below alike, CONFIGURATION.
dotenv.config();//INFO:How to reach dotenv configuration

//INFO: how import routes
const userRoute = require("./routes/user");
const mainRoute = require("./routes/index");
const authRoute = require("./routes/auth");

//app.use = Middlewares
app.use(express.json()); //INFO: how to helps api to understand JSON format.


//INFO: use routes
app.use("/api", mainRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


mongoose
.connect(process.env.MONGO_URL)
.then(()=> {console.log("db connection established")}) //INFO:connect function is a promise.
.catch((err)=>{
    console.log(err)
});


app.listen(5000, ()=> {
    console.log("backend server is running at ");
})