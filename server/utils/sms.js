const twilio = require('twilio');

// Initialize Twilio client
const initializeTwilio = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
};

// Send SMS using Twilio
const sendSMS = async (options) => {
  try {
    const client = initializeTwilio();
    
    if (!client) {
      console.warn('Twilio not configured. SMS not sent.');
      return { success: false, message: 'SMS service not configured' };
    }

    const message = await client.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: options.to
    });

    console.log('SMS sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};

// Send bulk SMS
const sendBulkSMS = async (recipients, message) => {
  try {
    const client = initializeTwilio();
    
    if (!client) {
      console.warn('Twilio not configured. Bulk SMS not sent.');
      return { success: false, message: 'SMS service not configured' };
    }

    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: recipient
        });
        results.push({ recipient, success: true, messageId: result.sid });
      } catch (error) {
        results.push({ recipient, success: false, error: error.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Bulk SMS sending error:', error);
    throw error;
  }
};

// Send WhatsApp message (if Twilio WhatsApp is configured)
const sendWhatsApp = async (options) => {
  try {
    const client = initializeTwilio();
    
    if (!client) {
      console.warn('Twilio not configured. WhatsApp message not sent.');
      return { success: false, message: 'WhatsApp service not configured' };
    }

    const message = await client.messages.create({
      body: options.message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${options.to}`
    });

    console.log('WhatsApp message sent:', message.sid);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    throw error;
  }
};

// Send verification code via SMS
const sendVerificationCode = async (phoneNumber, code) => {
  try {
    const message = `Your verification code for AI Tournament Management System is: ${code}. This code will expire in 10 minutes.`;
    
    return await sendSMS({
      to: phoneNumber,
      message
    });
  } catch (error) {
    console.error('Verification code sending error:', error);
    throw error;
  }
};

// Send tournament notification via SMS
const sendTournamentNotification = async (phoneNumber, tournamentName, message) => {
  try {
    const smsMessage = `Tournament Update - ${tournamentName}: ${message}`;
    
    return await sendSMS({
      to: phoneNumber,
      message: smsMessage
    });
  } catch (error) {
    console.error('Tournament notification sending error:', error);
    throw error;
  }
};

// Send match reminder via SMS
const sendMatchReminder = async (phoneNumber, matchDetails) => {
  try {
    const { tournamentName, matchTime, opponent, venue } = matchDetails;
    
    const message = `Match Reminder: You have a match in ${tournamentName} at ${matchTime} against ${opponent} at ${venue}. Good luck!`;
    
    return await sendSMS({
      to: phoneNumber,
      message
    });
  } catch (error) {
    console.error('Match reminder sending error:', error);
    throw error;
  }
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendWhatsApp,
  sendVerificationCode,
  sendTournamentNotification,
  sendMatchReminder
};