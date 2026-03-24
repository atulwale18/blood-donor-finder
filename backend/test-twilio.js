require('dotenv').config({ path: './.env' });
const twilio = require('twilio');

const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

console.log("SID:", sid, "TOKEN:", token ? "Exists" : "Missing");

const twilioClient = twilio(sid, token);

twilioClient.messages.create({
  from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886'}`,
  to: `whatsapp:+917820946531`,
  body: '🚨 Test from Blood Donor Finder Backend!'
}).then(msg => {
  console.log("Success! Message SID:", msg.sid);
}).catch(err => {
  console.log("Twilio Error:", err.message);
});
