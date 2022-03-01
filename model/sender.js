const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// the sender's schema
const SenderSchema = new mongoose.Schema({
	firstName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		lowercase: true,
		trim: true
	},
	lastName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		lowercase: true,
		required: [true, "Please provide lastName"],
		trim: true
	},
	location: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide location"],
		lowercase: true,
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
	
})


// hashing the password before saving to the database
SenderSchema.pre("save", async function (next) {
	if(!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})


// method that matches user password
SenderSchema.methods.matchPassword = async function(password){
	return await bcrypt.compare(this.password, password)
}

// token generation method (this is not asynchronous)
SenderSchema.methods.genSenderToken = function () {
	return jwt.sign(
		{id: this._id},
		process.env.JWT_SECRET,
		{expiresIn: process.env.JWT_EXPIRY}
		)
	}

// creating the model
const Sender = mongoose.model("Sender", SenderSchema)
	
module.exports = Sender