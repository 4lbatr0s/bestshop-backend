const express =  require('express');
const app = express(); //INFO: how to create a web application.
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cryptojs = require('crypto-js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

//INFO: app.set or examples below alike, CONFIGURATION.
dotenv.config();//INFO:How to reach dotenv configuration

//INFO: how import routes
const userRoute = require("./routes/user");
const mainRoute = require("./routes/index");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");


//app.use = Middlewares

app.use(cors());
app.use(express.json()); //INFO: how to helps api to understand JSON format.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//INFO: use routes
app.use("/api", mainRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/carts", cartRoute);
app.use("/api/checkout", stripeRoute);

mongoose
.connect(process.env.MONGO_URL)
.then(()=> {console.log("db connection established")}) //INFO:connect function is a promise.
.catch((err)=>{
    console.log(err)
});


app.listen(5000, ()=> {
    console.log("backend server is running at ");
})