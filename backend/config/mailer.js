const axios = require('axios');

/* =====================
   CUSTOM MAILER VIA VERCEL TO BYPASS RENDER SMTP BLOCK
===================== */
const transporter = {
  sendMail: async (mailOptions) => {
    try {
      const response = await axios.post("https://ai-powered-blood-donor-finder.vercel.app/api/send-email", {
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
        attachments: mailOptions.attachments ? mailOptions.attachments.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          content: att.content.toString('base64')
        })) : []
      });
      console.log("Email forwarded to Vercel successfully");
      return response.data;
    } catch (err) {
      console.error("Failed to forward email to Vercel:", err.message);
      throw err;
    }
  }
};

module.exports = transporter;
