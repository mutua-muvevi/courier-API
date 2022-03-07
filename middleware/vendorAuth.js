const jwt = require("jsonwebtoken");
const Vendor = require("../model/vendor");
const ErrorResponse = require("../utils/errorResponse");

exports.protectVendorRoute = async (req, res, next) => {
	let token;

	if(req.headers.authorization, req.headers.authorization.startWith("Bearer")){
		token = req.headers.authorization.split(" ")[1]
	}

	if (!token){
		return next(new ErrorResponse("Not Authorized to access this route", 401))
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const vendor = await Vendor.findById(decoded.id)
		
		if(!vendor){
			return next(new ErrorResponse("No user found with this id", 404))
		}
		
		req.vendor = vendor
		next()
	} catch (error) {
		next(new ErrorResponse("Not Authorized to access this route", 401))
	}
}