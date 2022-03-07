const jwt = require("jsonwebtoken");
const Transporter = require("../model/transporter");
const ErrorResponse = require("../utils/errorResponse");

exports.protectTransporterRoute = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        return next(new ErrorResponse("Not Authorized to access this route", 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const transporter = await Transporter.findById(decoded.id)

        if(!transporter){
            return next(new ErrorResponse("No user found with this id", 404))
        }

        req.transporter = transporter
        next()
    } catch (error) {
        next(new ErrorResponse("Not Authorized to access this route", 401))
    }
}