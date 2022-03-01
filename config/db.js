const mongoose = require("mongoose");
const winston = require("winston")


const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	winston.info("Connected to the Database")
}

module.exports = connectDB