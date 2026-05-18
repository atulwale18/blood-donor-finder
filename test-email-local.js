const transporter = require("./backend/config/mailer");
const mailOptions = {
  from: "Blood Donor Finder <blooddonorportal@gmail.com>",
  to: "atulwale4@gmail.com",
  subject: "🚨 Test Email from your Codebase",
  html: "<h2>Your code works!</h2><p>This email proves that the Node.js backend can successfully send emails.</p><p>If this is working locally, but not on your live website, it means your Render server has not been deployed recently and is running an old version of the code.</p>"
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
