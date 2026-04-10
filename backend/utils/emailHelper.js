import nodemailer from 'nodemailer';

/**
 * Send an email using SMTP transport.
 * Values are pulled from environment variables.
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter
    // Note: User needs to configure these in .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"MediCare Hospital" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Templates
 */
export const sendAppointmentEmail = async (patientEmail, appointmentDetails) => {
  const { date, time, doctorName } = appointmentDetails;
  return await sendEmail({
    to: patientEmail,
    subject: 'Appointment Confirmation - MediCare',
    text: `Your appointment with Dr. ${doctorName} is confirmed for ${date} at ${time}.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
        <p>Dear Patient,</p>
        <p>Your appointment has been successfully scheduled.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><b>Doctor:</b></td><td style="padding: 8px; border-bottom: 1px solid #eee;">Dr. ${doctorName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><b>Date:</b></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${date}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><b>Time:</b></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${time}</td></tr>
        </table>
        <p style="margin-top: 20px;">Please arrive 15 minutes early. Thank you for choosing MediCare.</p>
      </div>
    `,
  });
};

export const sendLabResultEmail = async (patientEmail, testDetails) => {
  const { testName, patientName } = testDetails;
  return await sendEmail({
    to: patientEmail,
    subject: `Lab Results Ready - ${testName}`,
    text: `Dear ${patientName}, your test results for ${testName} are now available in your portal.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #9333ea;">Lab Results Available</h2>
        <p>Dear ${patientName},</p>
        <p>Your diagnostic test results for <b>${testName}</b> have been completed and uploaded to the system.</p>
        <p>You can view the full report by logging into your patient dashboard or visiting the hospital laboratory.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This is an automated notification. Please do not reply to this email.</p>
      </div>
    `,
  });
};
