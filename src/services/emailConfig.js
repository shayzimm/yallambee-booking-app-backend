import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

// Transporter is Nodemailer Config to Gmail and to env variable
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

export default transporter;