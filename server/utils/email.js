const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Create transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'smtp') {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // Use Ethereal for development
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'your-ethereal-username',
        pass: 'your-ethereal-password'
      }
    });
  }
};

// Load email template
const loadTemplate = (templateName, context) => {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.hbs`);
  
  try {
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(context);
  } catch (error) {
    console.error(`Template ${templateName} not found, using default`);
    // Return a simple HTML template if specific template not found
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${context.appName || 'AI Tournament Management System'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${context.appName || 'AI Tournament Management System'}</h1>
          </div>
          <div class="content">
            <h2>Hello ${context.firstName || 'User'},</h2>
            <p>${context.message || 'This is a notification from our system.'}</p>
            ${context.buttonText ? `<a href="${context.buttonUrl}" class="button">${context.buttonText}</a>` : ''}
          </div>
          <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} ${context.appName || 'AI Tournament Management System'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    // Load and compile template if template is specified
    let html = options.html;
    if (options.template && options.context) {
      html = loadTemplate(options.template, options.context);
    }
    
    // Default text content if not provided
    const text = options.text || options.html || 'Notification from AI Tournament Management System';
    
    // Mail options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'AI Tournament Management'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      text: text,
      html: html
    };
    
    // Add CC if provided
    if (options.cc) {
      mailOptions.cc = options.cc;
    }
    
    // Add BCC if provided
    if (options.bcc) {
      mailOptions.bcc = options.bcc;
    }
    
    // Add attachments if provided
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (emails, subject, template, context) => {
  try {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await sendEmail({
          to: email,
          subject,
          template,
          context
        });
        results.push({ email, success: true, messageId: result.messageId });
      } catch (error) {
        results.push({ email, success: false, error: error.message });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Bulk email sending error:', error);
    throw error;
  }
};

// Send email with retry logic
const sendEmailWithRetry = async (options, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmail(options);
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  sendEmailWithRetry,
  createTransporter
};