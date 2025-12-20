import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContactFormData {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  message: string;
  agree: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, firstName, lastName, email, message, agree }: ContactFormData = req.body;

    // Validation
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    if (!agree) {
      return res.status(400).json({ error: 'You must agree to the Terms and Conditions' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not configured');
      return res.status(500).json({ error: 'Email service is not configured' });
    }

    // Determine the name to use
    const name = fullName || (firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || 'User');

    // Prepare email content
    const emailContent = {
      to: process.env.CONTACT_EMAIL || process.env.SENDGRID_TO_EMAIL || 'contact@easyspeak.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@easyspeak.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
New contact form submission:
Name: ${name}
Email: ${email}
Message:
${message}
---
This email was sent from the EasySpeak contact form.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3f5cff;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">This email was sent from the EasySpeak contact form.</p>
        </div>
      `,
    };

    // Send email via SendGrid
    await sgMail.send(emailContent);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error: any) {
    console.error('Error sending email:', error);

    // Handle SendGrid specific errors
    if (error.response) {
      const { body, statusCode } = error.response;
      return res.status(statusCode || 500).json({
        error: 'Failed to send email. Please try again later.',
        details: body?.errors?.[0]?.message || 'Unknown error'
      });
    }

    return res.status(500).json({
      error: 'An error occurred while sending your message. Please try again later.'
    });
  }
}
