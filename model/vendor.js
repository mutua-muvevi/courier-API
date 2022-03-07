const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// the vendor schema
const VendorSchema = new mongoose.Schema({
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
	businessName: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your business name"],
		unique: true,
		trim: true
	},
	businessLocation: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide your business location"],
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
	industryType: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please enter industry's type"],
		trim: true
	},
	password: {
		type: String,
		minlength: [5, "This field requires a minimum of 5 characters"],
		maxlength: [1500, "This field requires a minimum of 1500 characters"],
		required: [true, "Please provide password"],
	},
	resetPasswordToken : String,
	resetPasswordExpiry : Date
}, {timestamps: true})

// hashing the password before saving to database
VendorSchema.pre("save", async function(next){
	if(!this.isModified("password")){
		next()
	}

	// salting and hashing the password
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
	next()
})

// comparing passwords method
VendorSchema.methods.matchVendorPassword = async function(password) {
	return await bcrypt.compare(password, this.password)
}

// token generation method
VendorSchema.methods.genVendorToken = function(){
	return jwt.sign(
		{id: this.id},
		process.env.JWT_SECRET,
		{expiresIn: process.env.JWT_EXPIRY}
	)
}

// password token reset generation method
VendorSchema.methods.genVendorPasswordResetToken = function() {
	// creating the token
	const resetVendorToken = crypto.randomBytes(10).toString("hex")

	// hashing the created vendor reset token & saving the hashed in the DB
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetVendorToken)
		.digest("hex")
	
	// adding expiry value to reset password expiry
	this.resetPasswordExpiry = Date.now() + 30*(60*1000)
	return resetVendorToken
}

// the model
const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor