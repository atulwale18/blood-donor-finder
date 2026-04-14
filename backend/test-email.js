const transporter = require("./config/mailer");

const mailOptions = {
  from: "Blood Donor Finder <blooddonorportal@gmail.com>",
  to: "test@example.com", // Replace with a real email for testing
  subject: "Test Email from Blood Donor Finder",
  html: "<h1>Test Email</h1><p>This is a test email to check if email notifications are working.</p>"
};

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log("Email sent successfully:", info.messageId);
  })
  .catch((error) => {
    console.log("Error sending email:", error.message);
  });