const Sender = require("../model/sender");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.senderRegister = async (req, res, next) => {

	try {
		
		const {firstName, lastName, location, email, telephone, password } = req.body

		const sender = await Sender.create({firstName, lastName, location, email, telephone, password })

		sendSenderToken(sender, 201, res)

	} catch (error) {
		next(error)
	}


}

exports.senderLogin = async (req, res, next) => {
	const {email, password} = req.body 

	// checking if the above fields are filled
	if (!email || !password) {
		return next(new ErrorResponse("Invalid User's Credentials", 404))
	}

	try {

		// finding the email from the database
		const sender = await Sender.findOne({email}).select("+password")

		if (!sender) {
			return next(new ErrorResponse("Invalid User's Credentials", 404))
		}

		// matching passwords
		const isMatch = await sender.matchSenderPassword(password)

		if (!isMatch) {
			return next(new ErrorResponse("Invalid User's Credentials", 400))
		}

		sendSenderToken(sender, 200, res)
		
	} catch (error) {
		next(error)
	}
}

exports.senderForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		// checking if the email exists
		const sender = await Sender.findOne({email})

		if(!email) {
			return next (new ErrorResponse("Email could not be sent", 400))
		}

		const resetToken = sender.genSenderPasswordResetToken()
		await sender.save()

		// generating a front end link
		const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`

		const message = `
			<h1>You have requested an email reset</h1>
			<p>Please go to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		// sending the mail
		try {
			await sendEmail({
				to: sender.email,
				subject: "Password Reset",
				text: message
			})

			// send a success message
			res.status(200).json({
				success: true,
				data: "Email sent successfully"
			})

		} catch (error) {
			// disabling any usage of resetPasswordExpiry and resetPasswordToken when an error occurs
			sender.resetPasswordToken = undefined
			sender.resetPasswordExpiry = undefined

			await sender.save()
			return next(new ErrorResponse("Email could not be send", 500))
		}
		 
	} catch (error) {
		next(error)
	}
}

exports.senderResetPassword = async (req, res, next) => {
	// comparing the URL params to the hashed token that we created
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	
	try {
		
		// check to see if that specific reset password token and reset password expiry exists
		const sender = await Sender.findOne({
			resetPasswordToken,
			resetPasswordExpiry: {$gt : Date.now()}
		})

		if(!sender){
			return next(new ErrorResponse("Invalid token", 400))
		}

		// reseting the password
		sender.password= req.body.password
		
		// preventing the reset password token and reset password expiry to be used again
		sender.resetPasswordToken = undefined
		sender.resetPasswordExpiry = undefined

		await sender.save()

		res.status(200).json({
			success: true,
			data: "Password changed successfuly"
		})

	} catch (error) {
		next(error)
	}
}

// send token function
const sendSenderToken = (sender, statusCode, res) => {
	const token = sender.genSenderToken()

	res.status(statusCode).json({
		success: true,
		token
	})
}