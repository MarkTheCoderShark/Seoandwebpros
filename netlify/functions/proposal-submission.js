const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Received proposal submission:', event.body);

    if (!event.body) {
      throw new Error('Request body is required');
    }

    const formData = JSON.parse(event.body);
    const { fullName, email, phone, service, submittedWebsite } = formData;
    
    // Validate required fields
    if (!fullName || !email || !service) {
      throw new Error('Full name, email, and service are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Create email content
    const emailContent = createEmailContent(formData);
    
    // Send email notification
    await sendEmailNotification(emailContent);
    
    console.log('Proposal submission processed successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Proposal submitted successfully. We\'ll be in touch within 24 hours!'
      })
    };
  } catch (error) {
    console.error('Error in proposal submission handler:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error',
        type: error.name,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};

function createEmailContent(formData) {
  const { fullName, email, phone, service, submittedWebsite } = formData;
  
  const serviceLabels = {
    'seo': 'SEO Optimization',
    'web-development': 'Web Development',
    'content-marketing': 'Content Marketing',
    'paid-advertising': 'Paid Advertising',
    'social-media': 'Social Media Marketing',
    'consultation': 'General Consultation'
  };

  const serviceLabel = serviceLabels[service] || service;

  return {
    subject: `New Proposal Request - ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Proposal Request</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Contact Information</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Service Requested</h3>
          <p><strong>Service:</strong> ${serviceLabel}</p>
        </div>

        ${submittedWebsite ? `
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Website Information</h3>
          <p><strong>Website URL:</strong> <a href="${submittedWebsite}" target="_blank">${submittedWebsite}</a></p>
        </div>
        ` : ''}

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="margin-top: 0; color: #166534;">Next Steps</h3>
          <p>This lead came from the website submission form. Please:</p>
          <ul>
            <li>Review the website (if provided)</li>
            <li>Prepare a customized proposal</li>
            <li>Follow up within 24 hours</li>
          </ul>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          <p><strong>Submission Details:</strong></p>
          <p>Date: ${new Date().toLocaleString()}</p>
          <p>Source: Website CTA Form</p>
        </div>
      </div>
    `,
    text: `
New Proposal Request

Contact Information:
Name: ${fullName}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Service Requested:
Service: ${serviceLabel}

${submittedWebsite ? `
Website Information:
Website URL: ${submittedWebsite}
` : ''}

Next Steps:
- Review the website (if provided)
- Prepare a customized proposal
- Follow up within 24 hours

Submission Details:
Date: ${new Date().toLocaleString()}
Source: Website CTA Form
    `
  };
}

async function sendEmailNotification(emailContent) {
  // Configure email transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Email configuration
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email notification');
  }
} 