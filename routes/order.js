const router = require("express").Router();
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const cryptojs = require("crypto-js");
const dotenv = require("dotenv");
const Order = require("../models/Order");

dotenv.config();


//CREATE 
//TIP: every user can create a new Cart
router.post("/", verifyTokenAndAuthorization, async(req, res) => { 
    const newCart = new Order(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE CART,
//TIP: User can update the order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder =  await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE ORDER
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    } catch (error) {
        res.status(500).json(err);
    }
})


//GET BY ID
//TIP: GET User orders.
router.get("/find/:id", verifyTokenAndAuthorization,  async (req,res) => {
    try {
        const userOrders = await Order.find({userId:req.params.id}); //INFO: How to use findOne MongoDB model.
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ORDER BY ID
router.get("/find/:id", verifyTokenAndAuthorization,  async (req,res) => {
    try {
        const order = await Order.findById({userId:req.params.id}); //INFO: How to use findOne MongoDB model.
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ALL PRODUCTS
//INFO: How to use multiple filter to fetch data in MONGODB!
router.get("/", verifyTokenAndAdmin, async(req, res)=> {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
})

//STATS:
//INFO: How to create get monthly income data stats:
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth= new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date (date.setMonth(lastMonth.getMonth()-1));

    try {
        const income = await Order.aggregate([
            {$match: {createdAt:{$gte:previousMonth}}},
            {$project: {
                month:{$month:"$createdAt"},
                sales:"$amount"
            }},
            {$group:{
                _id:"$month",
                total:{$sum:"$sales"}
            }}
        ])
        res.status(200).json(income); 
    } catch (error) {
        res.status(500).json(error);
    }
})  

module.exports = router;