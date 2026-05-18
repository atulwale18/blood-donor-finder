const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, html, attachments } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "blooddonorportal@gmail.com",
        pass: "kltd dwfv txnd dtzz" 
      }
    });

    const parsedAttachments = attachments ? attachments.map(att => ({
      filename: att.filename,
      contentType: att.contentType,
      content: Buffer.from(att.content, 'base64')
    })) : [];

    await transporter.sendMail({
      from: "Blood Donor Finder <blooddonorportal@gmail.com>",
      to,
      subject,
      html,
      attachments: parsedAttachments
    });

    res.status(200).json({ message: "Email sent successfully via Vercel Edge SMTP" });
  } catch (error) {
    console.error("Vercel Email Error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
}
