import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendBookingConfirmation(
  to: string,
  bookingDetails: {
    id: string;
    date: string;
    time: string;
    service: string;
    price: number;
  }
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Booking Confirmation - Lammy\'s Multi Services',
    html: `
      <h1>Booking Confirmation</h1>
      <p>Thank you for choosing Lammy's Multi Services!</p>
      <h2>Booking Details:</h2>
      <ul>
        <li>Booking ID: ${bookingDetails.id}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Service: ${bookingDetails.service}</li>
        <li>Price: £${bookingDetails.price.toFixed(2)}</li>
      </ul>
      <p>If you need to make any changes to your booking, please contact us or visit our website.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendBookingReminder(
  to: string,
  bookingDetails: {
    id: string;
    date: string;
    time: string;
    service: string;
  }
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Booking Reminder - Lammy\'s Multi Services',
    html: `
      <h1>Booking Reminder</h1>
      <p>This is a friendly reminder of your upcoming appointment at Lammy's Multi Services.</p>
      <h2>Booking Details:</h2>
      <ul>
        <li>Booking ID: ${bookingDetails.id}</li>
        <li>Date: ${bookingDetails.date}</li>
        <li>Time: ${bookingDetails.time}</li>
        <li>Service: ${bookingDetails.service}</li>
      </ul>
      <p>If you need to reschedule, please contact us as soon as possible.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending reminder:', error);
    throw error;
  }
}
