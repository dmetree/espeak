# Contact Form Setup Guide

This guide explains how to set up the contact form with SendGrid email service.

## Installation

The `@sendgrid/mail` package has been installed. If you need to reinstall:

```bash
npm install @sendgrid/mail
```

## Environment Variables

Add the following environment variables to your `.env.local` file (or your environment configuration):

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@easyspeak.com
CONTACT_EMAIL=contact@easyspeak.com
# OR use SENDGRID_TO_EMAIL instead of CONTACT_EMAIL
SENDGRID_TO_EMAIL=contact@easyspeak.com
```

## SendGrid Setup Steps

1. **Create a SendGrid Account**
   - Go to https://sendgrid.com and sign up for a free account
   - Free tier includes 100 emails per day

2. **Create an API Key**
   - Navigate to Settings > API Keys in your SendGrid dashboard
   - Click "Create API Key"
   - Give it a name (e.g., "EasySpeak Contact Form")
   - Select "Full Access" or "Restricted Access" with Mail Send permissions
   - Copy the API key and add it to your `.env.local` as `SENDGRID_API_KEY`

3. **Verify Sender Identity**
   - Go to Settings > Sender Authentication
   - Verify a Single Sender (for testing) or set up Domain Authentication (for production)
   - Use the verified email as your `SENDGRID_FROM_EMAIL`

4. **Set Recipient Email**
   - Set `CONTACT_EMAIL` or `SENDGRID_TO_EMAIL` to the email address where you want to receive contact form submissions

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the landing page and fill out the contact form

3. Check your email inbox for the contact form submission

## Features

- ✅ Form validation (email format, required fields, message length)
- ✅ Loading state during submission
- ✅ Success/error toast notifications
- ✅ Responsive design (mobile and desktop)
- ✅ Terms and Conditions checkbox validation
- ✅ Automatic form reset after successful submission

## Troubleshooting

### Emails not sending?

1. **Check API Key**: Ensure `SENDGRID_API_KEY` is set correctly
2. **Check Sender Verification**: The `SENDGRID_FROM_EMAIL` must be verified in SendGrid
3. **Check Console**: Look for error messages in the browser console and server logs
4. **Check SendGrid Dashboard**: View activity logs in SendGrid to see if emails are being sent

### Common Errors

- **"Email service is not configured"**: `SENDGRID_API_KEY` is missing
- **"Invalid email address"**: Email format validation failed
- **"You must agree to the Terms and Conditions"**: Checkbox not checked
- **SendGrid API errors**: Check SendGrid dashboard for detailed error messages

## Alternative Email Services

If you prefer not to use SendGrid, you can modify `/pages/api/contact.ts` to use:
- Nodemailer (with SMTP)
- AWS SES
- Mailgun
- Resend
- Or any other email service

