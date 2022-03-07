const mongoose = require("mongoose");
const winston = require("winston");


const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		winston.info("Connected to the Database")
		
	} catch (error) {
		winston.error(`Database Connection Error : ${error}`)
	}

}

module.exports = connectDB