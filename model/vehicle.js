const mongoose = require("mongoose");

// vehicle schema
const VehicleSchema = new mongoose.Schema({
	// plane, ship, car
	type: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide the type of the vehicle"],
		trim: true
	},
	maxload: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide the maximum load of the vehicle"],
		trim: true
	},
	IDNumber: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide identification number/plate number of the vehicle"],
		trim: true,
		unique: true
	},
	range: {
		type: Number,
		min: [1, "This field requires a minimum value of 1"],
		max: [50000, "This field requires a maximum value of 50000"],
		required: [true, "Please provide range of the vehicle"],
		trim: true
	},
	// owner: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Transporter",
	// 	required: [true, "Please include the vehicle owner"]
	// },
}, {timestamps: true})

// vehicle model
const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle
