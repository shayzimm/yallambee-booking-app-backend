import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

// Nodemailer Config to env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Outputs succsessful connection the the Node console or error mesasge
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Nodemailer Configuration Error:', error);
    } else {
        console.log('SMTP Nodemailer Configuration Successful:', success);
    }
});

// function for sending the emails
const sendEmail = (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    return transporter.sendMail(mailOptions);
};

export default sendEmail;