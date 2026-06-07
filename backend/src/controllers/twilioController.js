import twilio from 'twilio';
import { processMessageWithAI } from './chatController.js';

let twilioClient;

const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

export const handleTwilioWebhook = async (req, res) => {
  try {
    const { Body: message, From: senderNumber, To: twilioNumber } = req.body;

    if (!message || !senderNumber) {
      return res.status(400).send('Bad Request');
    }

    // Twilio WhatsApp numbers come in the format "whatsapp:+1234567890"
    // We will use this exact string as the sessionId so their history persists!
    const sessionId = senderNumber;
    
    // Process the message using our Gemini MCP Logic
    const aiResponse = await processMessageWithAI(sessionId, message);

    // Send the response back via Twilio API
    const client = getTwilioClient();
    
    if (client) {
      await client.messages.create({
        body: aiResponse.reply,
        from: twilioNumber,
        to: senderNumber
      });
    } else {
      console.warn("Twilio client is not configured, but received a webhook. Make sure TWILIO_ACCOUNT_SID is set.");
    }

    // Acknowledge receipt to Twilio (empty TwiML is fine since we sent async message)
    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send('<Response></Response>');

  } catch (error) {
    console.error("Twilio Webhook Error:", error);
    res.setHeader('Content-Type', 'text/xml');
    res.status(500).send('<Response><Message>Sorry, our receptionist is currently offline. Please try again later.</Message></Response>');
  }
};
