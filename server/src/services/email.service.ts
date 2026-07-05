import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter =
  env.SMTP_HOST && env.SMTP_USER
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      })
    : null;

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!transporter) {
    console.log('[Email skipped - SMTP not configured]', { to, subject });
    return;
  }

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: Array.isArray(to) ? to.join(',') : to,
    subject,
    html,
  });
}

export function bookingConfirmationEmail(data: {
  customerName: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTimeSlot: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#0E2148">Booking Received</h2>
      <p>Hi ${data.customerName},</p>
      <p>Thank you for booking with Urban Home & Security. We have received your request.</p>
      <ul>
        <li><strong>Service:</strong> ${data.serviceTitle}</li>
        <li><strong>Date:</strong> ${data.preferredDate}</li>
        <li><strong>Time:</strong> ${data.preferredTimeSlot}</li>
      </ul>
      <p>Our team will review and confirm your appointment shortly.</p>
      <p style="color:#F2A81D;font-weight:bold">Urban Home & Security</p>
    </div>
  `;
}

export function adminBookingAlertEmail(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceTitle: string;
  preferredDate: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2 style="color:#0E2148">New Booking Request</h2>
      <p><strong>Customer:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>Phone:</strong> ${data.customerPhone}</p>
      <p><strong>Service:</strong> ${data.serviceTitle}</p>
      <p><strong>Date:</strong> ${data.preferredDate}</p>
    </div>
  `;
}

export function assignmentEmail(data: {
  memberName: string;
  serviceTitle: string;
  customerName: string;
  preferredDate: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2 style="color:#0E2148">New Job Assigned</h2>
      <p>Hi ${data.memberName},</p>
      <p>You have been assigned a new job:</p>
      <ul>
        <li><strong>Service:</strong> ${data.serviceTitle}</li>
        <li><strong>Customer:</strong> ${data.customerName}</li>
        <li><strong>Date:</strong> ${data.preferredDate}</li>
      </ul>
    </div>
  `;
}

export function statusUpdateEmail(data: {
  customerName: string;
  serviceTitle: string;
  status: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2 style="color:#0E2148">Booking Status Update</h2>
      <p>Hi ${data.customerName},</p>
      <p>Your booking for <strong>${data.serviceTitle}</strong> is now <strong>${data.status}</strong>.</p>
    </div>
  `;
}

export function contactAlertEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2 style="color:#0E2148">New Contact Message</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
      <p>${data.message}</p>
    </div>
  `;
}
