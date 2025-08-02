# Netlify Functions Setup

This directory contains Netlify serverless functions for the SEO & Web Pros website.

## Functions

### 1. SEO Audit (`seo-audit.js`)
Handles SEO audit requests and generates reports.

### 2. Proposal Submission (`proposal-submission.js`)
Handles proposal form submissions and sends email notifications.

## Email Configuration

To enable email notifications for proposal submissions, you need to set up the following environment variables in your Netlify dashboard:

### Required Environment Variables

1. **SMTP_USER** - Your email address (e.g., `your-email@gmail.com`)
2. **SMTP_PASS** - Your email password or app password
3. **NOTIFICATION_EMAIL** - Email address to receive notifications (optional, defaults to SMTP_USER)

### Optional Environment Variables

4. **SMTP_HOST** - SMTP server host (defaults to `smtp.gmail.com`)
5. **SMTP_PORT** - SMTP server port (defaults to `587`)

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Use the app password** as your `SMTP_PASS`

## Netlify Environment Variables Setup

1. Go to your Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add the following variables:

```
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=notifications@yourcompany.com
```

## Testing

After deployment, the proposal form will automatically send email notifications when users submit the form. The email will include:

- Contact information (name, email, phone)
- Service requested
- Website URL (if provided)
- Submission timestamp
- Next steps for follow-up

## Troubleshooting

If emails are not being sent:

1. Check Netlify function logs in the dashboard
2. Verify environment variables are set correctly
3. Ensure your email provider allows SMTP access
4. Check spam folder for test emails

## Security Notes

- Never commit email credentials to version control
- Use app passwords instead of regular passwords
- Consider using a dedicated email service like SendGrid for production 