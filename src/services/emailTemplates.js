// Email templates and messages defined here (Very basic for the minute, still a work in progress)
export const emailTemplates = {
    // KEY: is the template name and the :VALUE is the subject text and HTML
    welcome: {
        subject: 'Welcome to Yallambee Tiny Homes!',
        // Should pass in name as variable
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
        subject: 'Your Booking has been recieved! - Yallambee Tiny Homes',
        text: 'Dear {{name}},\n\nWe are delighted to confirm your booking with Yallambee Tiny Homes. Your stay is scheduled from {{startDate}} to {{endDate}}. If you have any questions, feel free to reach out to us. We look forward to hosting you!\n\nBest regards,\nThe Yallambee Team',
        html: `
          <h1>Booking Confirmation</h1>
          <p>Dear {{name}},</p>
          <p>We are delighted to confirm your booking with <strong>Yallambee Tiny Homes</strong>.</p>
          <p>Your stay is scheduled from <strong>{{startDate}}</strong> to <strong>{{endDate}}</strong>.</p>
          <p>If you have any questions, feel free to <a href="mailto:support@yallambeetinyhomes.com">reach out to us</a>.</p>
          <p>We look forward to hosting you!</p>
          <p>Best regards,<br/>The Yallambee Team</p>
        `
    },
    bookingReceived: {
        subject: 'Your Booking Request - Yallambee Tiny Homes',
        text: 'Dear {{name}},\n\nWe have received your booking request. Our team will review it, and you will be notified upon confirmation.\n\nBooking Reference: {{bookingId}}\nBooking Dates: {{startDate}} to {{endDate}}\n\nThank you for choosing Yallambee Tiny Homes!',
        html: '<h1>Dear {{name}},</h1><p>We have received your booking request. Our team will review it, and you will be notified upon confirmation.</p><p><strong>Booking Reference:</strong> {{bookingId}}</p><p><strong>Booking Dates:</strong> {{startDate}} to {{endDate}}</p><p>Thank you for choosing Yallambee Tiny Homes!</p>',
    },
    bookingUpdated: {
        subject: 'Your Booking Has Been Updated - Yallambee Tiny Homes',
        text: 'Dear {{name}},\n\nYour booking has been successfully updated.\n\nBooking Reference: {{bookingId}}\nNew Dates: {{startDate}} to {{endDate}}\n\nThank you for staying with Yallambee Tiny Homes.',
        html: '<h1>Dear {{name}},</h1><p>Your booking has been successfully updated.</p><p><strong>Booking Reference:</strong> {{bookingId}}</p><p><strong>New Dates:</strong> {{startDate}} to {{endDate}}</p><p>Thank you for staying with Yallambee Tiny Homes.</p>',
    },
    passwordReset: {
        subject: 'Password Reset Request - Yallambee Tiny Homes',
        text: 'Hello {{name}},\n\nYou requested to reset your password. Please click the link below to reset it:\n\n{{resetUrl}}\n\nIf you did not request this, please ignore this email.',
        html: '<h1>Hello {{name}},</h1><p>You requested to reset your password. Please click the link below to reset it:</p><a href="{{resetUrl}}">Reset Password</a><p>If you did not request this, please ignore this email.</p>',
      },
    // Ability to add more templates as needed
  };