import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { formName, formData } = JSON.parse(event.body);
    
    // Build HTML email content
    const rows = Object.entries(formData)
      .map(([key, val]) => `<tr><td><b>${key}</b></td><td>${val}</td></tr>`)
      .join('');

    const html = `
      <h2>New ${formName} Submission</h2>
      <table style="border-collapse:collapse">${rows}</table>
    `;

    // Send email using Resend
    await resend.emails.send({
      from: 'forms@notyoungfashion.com',
      to: 'markthecodershark@gmail.com',
      subject: `New ${formName} Submission - SEO & Web Pros`,
      html
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
}; 