const twilio = require("twilio");

let twilioClient;
if ((process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID) && process.env.TWILIO_AUTH_TOKEN) {
  const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
  twilioClient = twilio(sid, process.env.TWILIO_AUTH_TOKEN);
}

const sendWhatsApp = async (mobile, message) => {
  if (!twilioClient) {
    console.log("Twilio is not configured. Skipping WhatsApp message to", mobile);
    return;
  }
  if (!mobile) return;
  try {
    const toNum = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
      to: `whatsapp:${toNum}`,
      body: message
    });
    console.log("WhatsApp message sent to:", mobile);
  } catch (err) {
    console.error("WhatsApp error:", err.message);
  }
};

module.exports = { sendWhatsApp };
