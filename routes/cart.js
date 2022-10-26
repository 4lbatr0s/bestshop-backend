const router = require("express").Router();

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");
const cryptojs = require("crypto-js");
const dotenv = require("dotenv");
const Cart = require("../models/Cart");

dotenv.config();


//CREATE 
//TIP: every user can create a new Cart
router.post("/", verifyTokenAndAuthorization, async(req, res) => { 
    const newCart = new Product(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//UPDATE CART,
//TIP: User can update the cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart =  await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req,res)=> {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    } catch (error) {
        res.status(500).json(err);
    }
})


//GET BY ID
//TIP: User can react their card, therefore id is userId/
router.get("/find/:id", verifyTokenAndAuthorization,  async (req,res) => {
    try {
        const cart = await Cart.findOne({userId:req.params.id}); //INFO: How to use findOne MongoDB model.
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(err);
    }
})

//GET ALL PRODUCTS
//INFO: How to use multiple filter to fetch data in MONGODB!
router.get("/", verifyTokenAndAdmin, async(req, res)=> {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router; 

