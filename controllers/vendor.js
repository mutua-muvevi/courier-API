const Vendor = require("../model/vendor");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// the registration controller
exports.vendorRegistration = async (req, res, next) => {
	try {
		const {
			firstName, 
			lastName, 
			businessName, 
			businessLocation, 
			IDNumber, 
			industryType, 
			email, 
			telephone, 
			password 
		} = req.body

		const vendor = await Vendor.create({
			firstName, 
			lastName, 
			businessName, 
			businessLocation, 
			IDNumber, 
			industryType, 
			email, 
			telephone, 
			password 
		})

		sendVendorToken(vendor, 201, res)
		
	} catch (error) {
		next(error)
	}
}

// the login controller
exports.vendorLogin = async (req, res, next) => {

	const {email, password} = req.body

	try {
		if (!email || !password) {
			return next(new ErrorResponse("Invalid User Credentials", 400))
		}

		const vendor = await Vendor.findOne({email}).select("+password")

		if (!vendor){
			return next(new ErrorResponse("Invalid User Credentials", 404))
		}

		const isMatch = await vendor.matchVendorPassword(password)

		if(!isMatch){
			return next(new ErrorResponse("Invalid User Credentials", 400))
		}

		sendVendorToken(vendor, 200, res)

	} catch (error) {
		next(error)
	}
}

// send vendor token
const sendVendorToken = (vendor, statusCode, res) => {
	const token = vendor.genVendorToken()
	
	res.status(statusCode).json({
		success: true,
		token: token
	})
}