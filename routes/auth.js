const router = require("express").Router();
const User = require("../models/User");
const cryptojs = require("crypto-js");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

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
        !user && res.status(401).json("WRONG_CREDENTIALS");

        const decryptedPassword = cryptojs
        .AES
        .decrypt(user.password, process.env.SECRET_PASSPHRASE)
        .toString(cryptojs.enc.Utf8);  //INFO: how to decrypt a password!
        decryptedPassword !== req.body.password &&  res.status(401).json("WRONG_CREDENTIALS");
 
        const {password, ...others} = user._doc; //INFO: Dto, choose what you want to send as a response, we use __doc research!

        //INFO: how to create a jsonwebtoken, if we send our true credentials, then create jsonwebtoken
        const accessToken = jwt.sign({
            id:user._id,
            isAdmin: user.isAdmin
        }, 
        process.env.JWT_SECRET_KEY,
        {expiresIn:'3d'});

        res.status(200).json({...others, accessToken});//INFO: how to send accessToken

    }catch (err){
        res.status(500).json(err);
    }
})


module.exports = router;

