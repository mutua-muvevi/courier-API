const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// the admin Schema
const AdminSchema = mongoose.Schema({
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

// hashing the passwords method
AdminSchema.pre("save", async function(next){
	if(!this.isModified("password")){
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// matching password method
AdminSchema.methods.matchAdminPassword = async function(password){
	return await bcrypt.compare(password, this.password)
}

// generating jwt sign token method
AdminSchema.methods.genAdminToken = function(){
	return jwt.sign(
		{id: this._id},
		process.env.JWT_SECRET,
		{expiresIn : JWT.EXPIRY}
	)
}







// the model
const Admin = mongoose.model("Admin", AdminSchema)

module.exports = Admin