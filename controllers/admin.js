const Admin = require("../model/admin");
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Sender = require("../model/sender");
const Vendor = require("../model/vendor");
const Transporter = require("../model/transporter");

// registering the admin
exports.adminRegister = async (req, res, next) => {
	const {firstName,lastName, country, city, position, telephone, email, password } = req.body

	try {
		const admin = await Admin.create({firstName,lastName, country, city, position, telephone, email, password })

		sendAdminToken(admin,201, res)

	} catch (error) {
		next(error)
	}
}

// loggin in the admins
exports.adminLogin = async (req, res, next) => {
	const {email, password} = req.body

	try {

		if(!email || !password){
			return next(new ErrorResponse("Invalid User Credential", 400))
		}

		const admin = await Admin.findOne({email}).select("+password")

		if (!admin) {
			return next(new ErrorResponse("Invalid User Credential", 404))
		}

		const isMatch = await admin.comparePassword(password)

		if(!isMatch){
			return next(new ErrorResponse("Invalid User Credential", 400))
		}

		sendAdminToken(admin, 200, res)

	} catch (error) {
		next(error)
	}
}

// forgot password
exports.adminForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		if(!email){
			return next(new ErrorResponse("Invalid Email", 400))
		}

		const admin = await Admin.findOne({email})


		if(!admin){
			return next(new ErrorResponse("Could not send the email", 404))
		}

		// creating reset Token and saving it to the database
		const resetToken = admin.genPasswordResetToken()
		await admin.save()

		// reset url
		const resetUrl =  `http://localhost:3000/resetpassword/${resetToken}`

		// the message 
		const message = `
			<h1>You have requested an email reset</h1>
			<p>Please go to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>			
		`

		try {
			// sending forgot password email to admin
			await sendEmail({
				to: admin.email,
				subject: "Password Reset",
				text: message
			})

			res.status(200).json({
				success: true,
				data: "Email sent successfully"
			})

		} catch (error) {
			admin.resetPasswordToken = undefined
			admin.resetPasswordExpiry = undefined

			await admin.save()
			return next(new ErrorResponse("Something went wrong when sending the email", 500))
		}




	} catch (error) {
		next(error)
	}
}

// reset password
exports.adminResetPassword = async (req, res, next) => {
	
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		
		const admin = await Admin.findOne({
			resetPasswordToken,
			resetPasswordExpiry : {$gt : Date.now()}
		})
	
		if(!admin){
			return next(new ErrorResponse("Invalid token", 400))
		}

		admin.password = req.body.password

		admin.resetPasswordToken = undefined
		admin.resetPasswordExpiry = undefined

		await admin.save()

		res.status(200).json({
			success: true,
			data: "Password updated successfully"
		})

	} catch (error) {
		next(error)
	}

}

// get all senders
exports.getAllSenders = async (req, res, next) => {
	try {
		const senders = await Sender.find({}).sort();

		res.status(200).json({
			success: true,
			data: senders
		})
	} catch (error) {
		next(error)
	}
}

// get all vendors
exports.getAllVendors = async (req, res, next) => {
	try {
		const vendors = await Vendor.find({}).sort();

		res.status(200).json({
			success: true,
			data: vendors
		})
	} catch (error) {
		next(error)
	}
}

// get all transporters
exports.getAllTransporters = async (req, res, next) => {
	try {
		const transporter = await Transporter.find({}).sort();

		res.status(200).json({
			success: true,
			data: transporter
		})
	} catch (error) {
		next(error)
	}
}

// creating a send token function
const sendAdminToken = (admin, statusCode, res) => {
	token = admin.genAdminToken()

	res.status(statusCode).json({
		success: true,
		token: token
	})
}