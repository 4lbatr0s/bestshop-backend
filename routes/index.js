const router = require('express').Router();


router.get("/", (req,res)=> {
    res.send("INDEX");
});

module.exports = router;