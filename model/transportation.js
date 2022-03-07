const mongoose = require("mongoose");

// Transportation schema
const TransportationSchema = new mongoose.Schema({
	startPoint: {
		type: String,
		required: [true, "Please add your current location"],
		minlength: [15, "Starting point field requires a minimum of 5 characters"],
		maxlength: [50, "Starting point field requires a maximum of 500 characters"],
	},
	destination: {
		type: String,
		required: [true, "Please add your current location"],
		minlength: [15, "Destination field requires a minimum of 5 characters"],
		maxlength: [50, "Destination field requires a maximum of 500 characters"],
	},
	goodsDimension: {
		type: Array,
		required: [true, "Please add the goods length, width, and height"],
		min: [3, "Goods dimension requires a minimum of 5 characters"],
		max: [3, "Goods dimension requires a maximum of 500 characters"],
	},
	goodsState: {
		type: String,
		required: [true, "Please add the state of the goods solid, liquid or gas"],
		minlength: [3, "Goods state field requires a minimum of 5 characters"],
		maxlength: [6, "Goods state field requires a maximum of 500 characters"],
	},
	transporter: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Transporter",
		required: [true, "This field requires a transporter"],
	},
	vehicle: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vehicle",
		required: [true, "This field requires a vehicle"],
	}
}, {timestamps: true})

// the model
const Transportation = mongoose.model("Transportation", TransportationSchema);
module.exports = Transportation