const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");
const ErrorResponse = require("../utils/errorResponse");

exports.protectAdminRoute = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        return next(new ErrorResponse("Not Authorized to access this route", 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const admin = await Admin.findById(decoded.id)

        if(!admin){
            return next(new ErrorResponse("No user found with this id", 404))
        }

        req.admin = admin 
        next()

    } catch (error) {
        next(new ErrorResponse("Not Authorized to access this route", 401))
    }
}