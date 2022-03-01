require("dotenv").config({path: "./config.env"});

// node modules import
const express = require("express");
const connectDB = require("./config/db");
const winston = require("winston");

// custom mdules imports
const errorHandler = require("./middleware/error");

// run express
const app = express()

// database
connectDB()

// middleware imports
app.use(express.json())
app.use("/api/sender", require("./routes/sender"))

// error middleware
app.use(errorHandler)

// port
const PORT = process.env.PORT || 7000

// listening to port number
app.listen(PORT, () => winston.info(`The app is running on port ${PORT}`))


// node exit if error
process.on("unhandledRejection", (error, promise) => {
    winston.error("Unhandled Promise Rejection Error :", error)
    process.exit(1)
})