const router = require("express").Router();
const User = require("../models/User");
const cryptojs = require("crypto-js");
const dotenv = require('dotenv');

const ErrorMessages = require('../utilities/ErrorMessages');


dotenv.config();



//TODO: Move all these functions into Services.

//INFO: AUTHENTICATION ROUTE IS TO CREATE LOGIN,REGISTER ETC.


//INFO: HOW TO REGISTER
router.post("/register", async (req,res) => {
    //INFO: How to write a try catch block!
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        password: cryptojs.AES.encrypt(
            req.body.password, process.env.SECRET_PASSPHRASE)
            .toString() //TODO: Use hashing with SHA istead of encrypting with AES 
    })                  //INFO: how to save encrypted password in database.

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //INFO: status 201 successfully added!
    } catch(err) {
        res.status(500).json(err);
    }
   
})

router.post("/login",  async (req, res) => {
    try {
        const user = await User.findOne({username:req.body.username});
        !user && res.status(401).json(ErrorMessages.WRONG_CREDENTIALS);

        const decryptedPassword = cryptojs
        .AES
        .decrypt(user.password, process.env.SECRET_PASSPHRASE) //INFO: how to decrypt a password!
        const password = decryptedPassword.toString(cryptojs.enc.Utf8); 
        password !== req.body.password &&  res.status(401).json(ErrorMessages.WRONG_CREDENTIALS);

        res.status(200).json(user);
    }catch (err){
        res.status(500).json(err);
    }
})


module.exports = router;

