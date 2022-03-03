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

// the forgot password controller
exports.vendorForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		if(!email){
			return next(new ErrorResponse("Email could not be sent", 404))
		}

		const vendor = await Vendor.findOne({email})

		if(!vendor){
			return next(new ErrorResponse("Email could not be sent", 400))
		}

		// generating the reset token which we will save to the database
		const resetToken = vendor.genVendorPasswordResetToken()
		await vendor.save()

		// generating a front end link
		const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`

		// email template
		const message = `
			<h1>You have requested an email reset</h1>
			<p>Please go to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		// sending the email
		try {

			await sendEmail({
				to: vendor.email,
				subject: "Password Reset",
				text: message
			})
			

			res.status(200).json({
				success: true,
				data: "Email sent successfully"
			})

		} catch (error) {
			vendor.resetPasswordToken = undefined
			vendor.resetPasswordExpiry = undefined

			await vendor.save()
			return next(new ErrorResponse("Email could not be sent", 500))
		}

	} catch (error) {
		next(error)
	}
}

// the reset password controller
exports.vendorResetPassword = async (req, res, next) => {
	// hashing the token we have in the URL params

	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")

	try {

		const vendor = await Vendor.findOne({
			resetPasswordToken,
			resetPasswordExpiry: {$gt : Date.now()}
		})

		if(!vendor) {
			return next(new ErrorResponse("Invalid Token", 400))
		}

		// updating the password
		vendor.password = req.body.password

		// preventing double use of the reset token and its expiry
		vendor.resetPasswordToken = undefined
		vendor.resetPasswordExpiry = undefined

		await vendor.save()
		return res.status(200).json({
			success: true,
			data: "Password updated successfully"
		})
		
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