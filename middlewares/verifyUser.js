const jwt = require("jsonwebtoken");
const {sendErr} = require("../helpers/index");


module.exports = async(req,res,next) => {
    const bearer = req.headers.authorization;

    if(!bearer) return sendErr("No bearer token",404,res);

    const token = bearer.split(" ")[1];

    jwt.verify(token, process.env.SECRET, async(err,decoded)=>{
        if(err) return sendErr("Invalid token",404,res);

        const isAdmin = decoded.isAdmin;
        const code = decoded.code;

        req.user = {
            code,
            isAdmin
        };

        next();
    });
    
}