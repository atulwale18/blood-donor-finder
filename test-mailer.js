const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "blooddonorportal@gmail.com",
    pass: "kltd dwfv txnd dtzz" 
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("LOGIN FAILED:", error);
  } else {
    console.log("LOGIN SUCCESSFUL. Server is ready to take our messages");
  }
});
