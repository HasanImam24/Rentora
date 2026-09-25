import nodemailer from 'nodemailer';
import { config } from '../config/environment.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  }
});

export const sendComplaintNotification = async ({ ticketId, userName, userEmail, subject, description, priority }) => {
  const html = `
    <h2>New Complaint Submitted</h2>
    <p><strong>Ticket ID:</strong> ${ticketId}</p>
    <p><strong>User:</strong> ${userName} (${userEmail})</p>
    <p><strong>Priority:</strong> ${priority}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Description:</strong></p>
    <p>${description}</p>
  `;

  try {
    await transporter.sendMail({
      from: `RentBuy Platform <${config.smtp.user}>`,
      to: config.adminEmail,
      subject: `New Complaint: ${ticketId} - ${subject}`,
      html
    });
  } catch (error) {
    console.error('Error sending complaint email:', error);
  }
};

export const sendStatusUpdate = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `RentBuy Platform <${config.smtp.user}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};
