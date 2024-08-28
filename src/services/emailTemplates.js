// Email templates and messages defined here (Very basic for the minute, still a work in progress)
export const emailTemplates = {
    // key is the template name and the value is the subject text and HTML
    welcome: {
        subject: 'Welcome to Yallambee Tiny Homes!',
        text: `Hello {{name}},
    
    Thank you for signing up with Yallambee Tiny Homes! We're excited to have you on board.
    
    If you have any questions or need assistance, feel free to reach out to us. We’re here to help!
    
    Best regards,
    The Yallambee Tiny Homes Team`,
    
        html: `<html>
        <body>
            <h1>Hello {{name}},</h1>
            <p>Thank you for joining Yallambee Tiny Homes! We're thrilled to have you with us.</p>
            <p>If you have any questions or need support, please don't hesitate to <a href="mailto:support@yallambeetinyhomes.com">contact us</a>. We’re here to assist you!</p>
            <br />
            <p>Best regards,</p>
            <p>The Yallambee Tiny Homes Team</p>
        </body>
        </html>`
    },
    bookingConfirmation: {
      subject: 'Booking Confirmation',
      text: 'Your booking has been confirmed!',
      html: '<h1>Your booking has been confirmed!</h1>',
    },
    // Ability to add more templates as needed
  };