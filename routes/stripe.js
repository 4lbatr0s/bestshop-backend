const router =  require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY); //INFO: How to use stripe


//INFO: How to charge a client!
router.post("/payment", (req,res)=> {
    stripe.charges.create({
        source:req.body.tokenId, //INFO: when we send a stripe(stripe will be used in the frontend too..) payment from UI, stripe returns us a tokenId, we send that token to backend.
        amount: req.body.amount,
        currency:"usd"
    }, (stripeErr, stripeRes)=> {
        if(stripeErr){
            res.status(500).json(stripeErr);
        } else {
            res.status(200).json(stripeRes); 
        }
    });
});



module.exports = router;