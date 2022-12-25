const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const User = require("../models/User");
const router = require("express").Router();
const cryptojs = require("crypto-js");
const dotenv = require("dotenv");

dotenv.config();


//INFO: an update function, therefore put.
//INFO: verifyTokenAndAuthorization: a middleware function, next: async(req,res)
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    if(req.body.password){ //TIP: new password given, we should encrypt it before sending it to db.
        req.body.password = cryptojs.AES
        .encrypt(req.body.password, process.env.JWT_SECRET_KEY)
        .toString();
    }

    try{//INFO: How to update a mongodb model
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:req.body
        }, {new:true})//INFO:new true makes this function to return new updated user.

        const {password, ...others} = updatedUser._doc;//TIP: always get doc from updateduser or created user.

        res.status(200).json(others);
    } catch(err){
        res.status(500).json(err);
    }
})



router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (error) {
        res.status(500).json(err);
    }
})


//GET BY ID
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc; //TIP: dont send password.
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;
    //INFO: Bring 'last NEW' number of users.
    try {
        
        const users = query ? await User
        .find() //INFO: How to sort and limit MongoDB queries..
        .sort({_id:-1}) //sort by id descending! 
        .limit(5)
        : await User.find();
        res.status(200).json(users);//TODO: Do not return passwords.
    } catch (error) {
        res.status(500).json(err);
    }
})


//GETUSERSTATS
//INFO: HOW MANY PEOPLE REGISTERED FOR A PERIOD OF TIME...
router.get("/stats", verifyTokenAndAdmin, async (req, res)=> {
    const date = new Date();
    const lastYear =  new Date(date.setFullYear(date.getFullYear()-1)); //TIP: brings last year today.
    try {
        //TIP: HOW TO USE MONGODB AGGREGATE
        const data = await User.aggregate([
             {$match :{createdAt: {$gte: lastYear}}},

             {$project:{
                month:{$month:"$createdAt"}
             }}, //INFO: Take the month number inside of the createdAt variable and set it into month variable
        
             {$group: {
                _id:"$month", //month in the project.
                total: {$sum:1} //start from 1 and accumulate  
             }}
            ])
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;