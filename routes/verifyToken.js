const jwt = require("jsonwebtoken");
const dotenv  = require("dotenv");

dotenv.config();

//INFO: token verification middleware
const verifyToken = (req,res, next) => {
    const authHeader = req.headers.token
    const token = authHeader.split(" ")[1] //INFO: Bearer km2kmLJWLAML....
    if(authHeader) { //INFO: err,user => if everything is okey, verifyTOken will return us a DATA, you can name it whatever you like we called it user here.
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user)=> {
            if(err) res.status(403).json("Token is not valid");
            req.user = user; //INFO: WE PASS VALUE FROM MIDDLEWARE TO REQ BODY TO PASS DATA TO OTHER FUNCTIONS!
            next();//INFO: leave this function and go router.
        });
    } else {
        return res.status(401).json("You are not authenticated");
    }
}



const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res, ()=>   {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not authorized")
        }
    })
}

//TIP: some stuff just admins can do such as adding product to website..

const verifyTokenAndAdmin =(req,res, next)=> {
    verifyToken(req,res,()=> {
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not authorized");
        }
    }); 
}


module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}