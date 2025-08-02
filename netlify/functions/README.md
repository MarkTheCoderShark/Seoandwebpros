# Netlify Functions Setup

This directory contains Netlify serverless functions for the SEO & Web Pros website.

## Functions

### 1. SEO Audit (`seo-audit.js`)
Handles SEO audit requests and generates reports.

### 2. Form Handling
Proposal form submissions are handled automatically by Netlify's built-in form processing.

## Form Configuration

The proposal form uses Netlify's native form handling with the `netlify` attribute:

```html
<form name="proposal-submission" netlify>
```

## How It Works

1. **Automatic Processing**: When users submit the proposal form, Netlify automatically captures the data
2. **Dashboard Access**: All submissions appear in your Netlify dashboard under "Forms"
3. **Email Notifications**: You can configure email notifications directly in Netlify dashboard
4. **No Setup Required**: No SMTP configuration or environment variables needed

## Data Captured

The form automatically captures:
- Full Name
- Email Address
- Phone Number (optional)
- Service Requested
- Website URL (if provided)
- Submission timestamp

## Netlify Dashboard Setup

1. Go to your Netlify dashboard
2. Navigate to your site
3. Click on "Forms" tab
4. You'll see "proposal-submission" form listed
5. Click on the form to view submissions
6. Configure email notifications if desired

## Email Notifications (Optional)

To receive email notifications for form submissions:

1. In Netlify dashboard, go to Site settings → Forms
2. Enable "Form notifications"
3. Add your email address
4. Choose notification frequency (immediate, daily, weekly)

## Benefits

- **Zero Configuration**: Works out of the box
- **Reliable**: Netlify's infrastructure handles everything
- **Secure**: Data is encrypted and stored securely
- **Scalable**: Handles any volume of submissions
- **Exportable**: Download submissions as CSV
- **Spam Protection**: Built-in spam filtering

## No Additional Setup Required

Unlike custom email solutions, Netlify forms require no:
- SMTP configuration
- Environment variables
- Email service setup
- Server maintenance 