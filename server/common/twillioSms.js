const twilio=require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


module.exports ={ sendSMS : async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`Message sent with SID: ${message.sid}`);
    return message.sid;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}}


