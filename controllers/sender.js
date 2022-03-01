const Sender = require("../model/sender");

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