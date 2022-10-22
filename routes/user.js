const {verifyToken, verifyTokenAndAuthorization} = require("./verifyToken");
const User = require("../models/User");
const router = require("express").Router();
const cryptojs = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();


//INFO: an update function, therefore put.
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    if(req.body.password){ //INFO: we should check password before update.
        req.body.password = cryptojs.AES
        .encrypt(req.body.password, process.env.JWT_SECRET_KEY)
        .toString();
    }

    try{//INFO: How to update a mongodb model
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:req.body
        }, {new:true})//INFO:new true makes this function to return new updated user.

        const {password, ...others} = updatedUser;

        res.status(200).json(others);
    } catch(err){
        res.status(500).json(err);
    }
})




module.exports = router;