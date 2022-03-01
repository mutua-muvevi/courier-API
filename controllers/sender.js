const Sender = require("../model/sender");
const ErrorResponse = require("../utils/errorResponse")

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

}

exports.senderResetPassword = async (req, res, next) => {

}

// send token function
const sendSenderToken = (sender, statusCode, res) => {
	const token = sender.genSenderToken()

	res.status(statusCode).json({
		success: true,
		token
	})
}