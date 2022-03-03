const mongoose = require("mongoose");

// vehicle schema
const VehicleSchema = new mongoose.Schema({
	type: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	category: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	plateNumber: {
		type: String,
		minlength: [3, "This field requires a minimum of 3 characters"],
		maxlength: [50, "This field requires a maximum of 50 characters"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	range: {
		type: Number,
		min: [2, "This field requires a minimum value of 3"],
		max: [50, "This field requires a maximum value of 50"],
		required: [true, "Please provide firstName"],
		trim: true
	},
	owner: {
		type: Number,
		min: [2, "This field requires a minimum value of 3"],
		max: [50, "This field requires a maximum value of 50"],
		// required: [true, "Please provide firstName"],
		trim: true
	},
})

// vehicle model
const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle
