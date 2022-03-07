const Transporter = require("../model/transporter");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// registering a new transporter
exports.transporterRegister = async (req, res, next) => {
	const {firstName, lastName, aboutSelf, photo, currentLocation, IDNumber, telephone, vehicles, email, password } = req.body

	try {
		const transporter = await Transporter.create({firstName, lastName, aboutSelf, photo, currentLocation, IDNumber, telephone, vehicles, email, password })

		sendTransporterToken(transporter, 201, res)

	} catch (error) {
		next(error)
	}
}

// authenticating the transporter
exports.transporterLogin = async (req, res, next) => {
	const {email, password} = req.body

	try {
		
		if (!email || !password) {
			return next(new ErrorResponse("Invalid User Credential", 400))
		}

		const transporter = await Transporter.findOne({email}).select("+password")
		
		if (!transporter) {
			return next(new ErrorResponse("Invalid User Credential", 404))
		}

		const isMatch = await transporter.matchPasswords(password)

		if (!isMatch) {
			return next(new ErrorResponse("Invalid User Credential", 400))
		}

		sendTransporterToken(transporter, 200, res)

	} catch (error) {
		next(error)
	}
}

// forgot password controller
exports.transporterForgotPassword = async (req, res, next) => {
	const {email} = req.body

	try {
		if (!email) {
			return next(new ErrorResponse("Email could not be sent", 400))
		}

		const transporter = await Transporter.findOne({email})

		if(!transporter) {
			return next(new ErrorResponse("Email could not be sent", 404))
		}

		const resetToken = transporter.genResetToken()
		await transporter.save()

		const resetUrl =  `http://localhost:3000/resetpassword/${resetToken}`

		const message = `
			<h1>You have requested an email reset</h1>
			<p>Please go to this link to reset your password, If you have not request for password reset please ignore this message.</p>
			<a href=${resetUrl} clicktracking=off>
				${resetUrl}
			</a>
		`

		try {
			await sendEmail({
				to: transporter.email,
				subject: "Password Reset",
				text: message
			})

			res.status(200).json({
				success: true,
				data: "Email sent successfully"
			})
		} catch (error) {
			transporter.resetPasswordToken = undefined
			transporter.resetPasswordExpiry = undefined

			await transporter.save()
			return next(new ErrorResponse("Something went wrong when sending the email", 500))
		}

	} catch (error) {
		next(error)
	}
}

// reset password method
exports.transporterResetPassword = async (req, res, next) => {

	// hashing the token that we have received in the param of the resetUrl above
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resetToken)
		.digest("hex")
	

	try {
		// find if there is a transporter with the token above
		const transporter = await Transporter.findOne({
			resetPasswordToken,
			resetPasswordExpiry : {$gt : Date.now()}
		})
	
		if(!transporter){
			return next(new ErrorResponse("Invalid token", 400))
		}

		// update the password
		transporter.password = req.body.password

		// preventing multiple uses of the token
		transporter.resetPasswordToken = undefined
		transporter.resetPasswordExpiry = undefined

		await transporter.save()

		res.status(200).json({
			success: true,
			data: "Password updated successfully"
		})
		
	} catch (error) {
		next(error)
	}

}

// method for sending token
const sendTransporterToken = (transporter, statusCode, res) => {
	const token = transporter.genTransporterToken()

	res.status(statusCode).json({
		success: true,
		token: token
	})
}