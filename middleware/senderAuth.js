const jwt = require("jsonwebtoken");
const Sender = require("../model/vendor");
const ErrorResponse = require("../utils/errorResponse");

exports.protectSenderAuth = async (req, res ,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        return next(new ErrorResponse("Not Authorized to access this route", 401))
    }

    try {
        
        const decoded = jwt.decode(token, process.env.JWT_SECRET)

        const sender = await Sender.findById(decoded.id)

        if(!sender){
            return next(new ErrorResponse("No user with that Token", 404))
        }

        req.sender = sender
        next()

    } catch (error) {
        next(new ErrorResponse("Not Authorized to access this route", 401
        ))
    }
}