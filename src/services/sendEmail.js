import transporter from '../services/emailConfig.js';
import { emailTemplates } from './emailTemplates.js';

// function for sending emails - Templetes are located in emailTemplates.js
const sendEmail = async (to, templateName, variables = {}) => {
    try {
      const template = emailTemplates[templateName];
      if (!template) {
        throw new Error('Template not found');
      }
  
      // Template processing
      // Varibles is optional, replace the variables in the template if needed 
      const { subject, text, html } = template;
      const finalHtml = Object.keys(variables).reduce(
        (acc, key) => acc.replace(`{{${key}}}`, variables[key]),
        html
      );
      const finalText = Object.keys(variables).reduce(
        (acc, key) => acc.replace(`{{${key}}}`, variables[key]),
        text
      );
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: subject || 'No Subject',
        text: finalText,
        html: finalHtml,
      };
      
      // sending the email
      const info = await transporter.sendMail(mailOptions);
      // Console logging the message ID
      console.log("Message sent: %s", info.messageId);
      // Returning info object which contains details regarding the sent email
      return info;
      // Error handling
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  
  export default sendEmail;