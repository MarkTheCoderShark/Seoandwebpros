const { auditResults } = require('./seo-audit');

exports.handler = async (event, context) => {
  const headers = {
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get auditId from query parameters
    const auditId = event.queryStringParameters?.auditId;
    
    if (!auditId) {
      throw new Error('Audit ID is required');
    }

    // Get the audit results
    const results = auditResults.get(auditId);
    
    if (!results) {
      throw new Error('Audit results not found');
    }

    // Generate the report content
    const reportContent = generateReport(results);
    
    // Return the report as a downloadable file
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="seo-audit-report-${results.url.replace(/[^a-z0-9]/gi, '-')}.html"`
      },
      body: reportContent
    };
  } catch (error) {
    console.error('Error in download handler:', error);
    
    return {
      statusCode: error.statusCode || 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error.message || 'Internal server error'
      })
    };
  }
};

function generateReport(results) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SEO Audit Report - ${results.url}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    .score {
      font-size: 24px;
      font-weight: bold;
      color: #27ae60;
    }
    .section {
      margin: 20px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 5px;
    }
    .recommendation {
      margin: 10px 0;
      padding: 10px;
      border-left: 4px solid #3498db;
      background: #fff;
    }
    .high-priority {
      border-left-color: #e74c3c;
    }
    .medium-priority {
      border-left-color: #f1c40f;
    }
    .metadata {
      color: #7f8c8d;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <h1>SEO Audit Report</h1>
  <div class="metadata">
    <p>URL: ${results.url}</p>
    <p>Date: ${new Date(results.auditDate).toLocaleString()}</p>
    <p>Email: ${results.email}</p>
  </div>

  <div class="section">
    <h2>Overall Score</h2>
    <div class="score">${results.score}%</div>
  </div>

  <div class="section">
    <h2>Performance Metrics</h2>
    ${results.technical?.performance?.score ? `
      <p>Page Speed Score: ${Math.round(results.technical.performance.score)}%</p>
      <p>First Contentful Paint: ${results.technical.performance.metrics.fcp}</p>
      <p>Largest Contentful Paint: ${results.technical.performance.metrics.lcp}</p>
      <p>Cumulative Layout Shift: ${results.technical.performance.metrics.cls}</p>
      <p>Speed Index: ${results.technical.performance.metrics.speed_index}</p>
    ` : '<p>Performance metrics not available</p>'}
  </div>

  <div class="section">
    <h2>On-Page SEO</h2>
    ${results.onPage?.meta ? `
      <h3>Meta Tags</h3>
      <p>Title: ${results.onPage.meta.title.content}</p>
      <p>Title Length: ${results.onPage.meta.title.length} characters (${results.onPage.meta.title.optimal ? 'Optimal' : 'Needs improvement'})</p>
      <p>Description: ${results.onPage.meta.description.content || 'Not found'}</p>
      <p>Description Length: ${results.onPage.meta.description.length} characters (${results.onPage.meta.description.optimal ? 'Optimal' : 'Needs improvement'})</p>
    ` : ''}
    
    ${results.onPage?.headings ? `
      <h3>Heading Structure</h3>
      <p>H1 Tags: ${results.onPage.headings.h1.count}</p>
      <p>H2 Tags: ${results.onPage.headings.h2.count}</p>
      <p>H3 Tags: ${results.onPage.headings.h3.count}</p>
    ` : ''}
    
    ${results.onPage?.images ? `
      <h3>Images</h3>
      <p>Total Images: ${results.onPage.images.total}</p>
      <p>Images Missing Alt Text: ${results.onPage.images.missing_alt}</p>
    ` : ''}
  </div>

  <div class="section">
    <h2>Technical SEO</h2>
    ${results.technical?.robots_txt ? `
      <p>Robots.txt: ${results.technical.robots_txt.exists ? 'Found' : 'Not found'}</p>
    ` : ''}
    ${results.technical?.sitemap ? `
      <p>Sitemap.xml: ${results.technical.sitemap.exists ? 'Found' : 'Not found'}</p>
    ` : ''}
  </div>

  <div class="section">
    <h2>Security</h2>
    ${results.security?.https ? `
      <p>HTTPS: ${results.security.https ? 'Enabled' : 'Not enabled'}</p>
    ` : ''}
    ${results.security?.ssl ? `
      <p>SSL Certificate: ${results.security.ssl.valid ? 'Valid' : 'Invalid'}</p>
      ${results.security.ssl.valid ? `<p>Expires: ${new Date(results.security.ssl.expires).toLocaleDateString()}</p>` : ''}
    ` : ''}
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    ${results.recommendations && results.recommendations.length > 0 ? 
      results.recommendations.map(rec => `
        <div class="recommendation ${rec.priority}-priority">
          <h3>${rec.category}</h3>
          <p><strong>Issue:</strong> ${rec.issue}</p>
          <p><strong>Recommendation:</strong> ${rec.recommendation}</p>
        </div>
      `).join('') 
      : '<p>No recommendations available</p>'
    }
  </div>
</body>
</html>
  `;
} 