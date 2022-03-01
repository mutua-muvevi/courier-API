const nodemailer = require("nodemailer")
const winston = require("winston")

// the transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

// mail options
const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text
}

// send mail action
transporter.sendMail(mailOptions, (error, info) => {
    if(error){
        winston.error(`Send Email Error: ${error}`)
    } else {
        winston.info(`Email sent : ${info}`)
    }
})