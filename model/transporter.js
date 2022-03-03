const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

// the transporter schema
const TransporterSchema = new mongoose.Schema({
	firstName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	lastName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide lastName"],
		trim: true
	},
	aboutSelf: {
		type: String,
		minlength: [50, "This field requires a minimum of 50 characters"],
		maxlength: [200, "This field requires a maximum of 200 characters"],
		required: [true, "Please provide little detail about you"],
		trim: true
	},
	photo: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your clear passport size photo"],
		trim: true
	},
	currentLocation: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide location"],
		trim: true
	},
	IDNumber: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide ID Number or a passport"],
		unique: true,
		trim: true
	},
	telephone: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide telephone"],
		unique: true,
		trim: true
	},
	email: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide an email"],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [1500, "This field requires a minimum of 1500 characters"],
		required: [true, "Please provide password"],
	},
	resetPasswordToken : String,
	resetPasswordExpiry : Date
})

// hashing password before they get saved to the database
TransporterSchema.pre("save", async function(next){
	if(!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// comparing the password method
TransporterSchema.methods.matchPasswords = async function(password){
	return await bcrypt.compare(password, this.password)
}

// method for generating auth tokens
TransporterSchema.methods.genTransporterToken = function (){
	return jwt.sign(
		{id: this._id},
		process.env.JWT_SECRET,
		{expiresIn: process.env.JWT_EXPIRY}
	)
}

// method for reset password tokens
TransporterSchema.methods.genResetToken = function() {
	const resetToken = crypto.randomBytes(10).toString("hex")

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex")
	
	this.resetPasswordExpiry = Date.now() + 30 * (60 * 1000)
	return resetToken
}

// the model
const Transporter = mongoose.model("Transporter", TransporterSchema)
module.exports = Transporter