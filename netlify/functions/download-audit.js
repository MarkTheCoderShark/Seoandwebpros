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

  if (event.httpMethod === 'POST') {
    try {
      const results = JSON.parse(event.body);
      console.log("Received audit results:", results);

      if (!results || !results.url) {
        throw new Error('Invalid audit data provided');
      }

      const reportContent = generateReport(results);

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
      console.error('Error in download handler:', error.message);
      
      return {
        statusCode: error.statusCode || 500,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: error.message || 'Internal server error' })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};

function generateReport(results) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SEO Audit Report - ${results.url}</title>
  <style>
    :root {
      --primary-color: #2563eb;
      --secondary-color: #1e40af;
      --success-color: #059669;
      --warning-color: #d97706;
      --danger-color: #dc2626;
      --text-color: #1f2937;
      --light-bg: #f3f4f6;
      --border-color: #e5e7eb;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px;
      color: var(--text-color);
      background: #fff;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 10px;
    }
    
    .metadata {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
      padding: 20px;
      background: var(--light-bg);
      border-radius: 8px;
    }
    
    .metadata-item {
      display: flex;
      flex-direction: column;
    }
    
    .metadata-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .metadata-value {
      font-weight: 500;
    }
    
    .score-container {
      text-align: center;
      margin: 40px 0;
    }
    
    .score {
      font-size: 48px;
      font-weight: 800;
      color: var(--primary-color);
      margin: 10px 0;
    }
    
    .score-label {
      font-size: 18px;
      color: #6b7280;
    }
    
    .section {
      margin: 30px 0;
      padding: 30px;
      background: var(--light-bg);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    
    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 8px;
    }
    
    .metric-label {
      font-size: 14px;
      color: #6b7280;
    }
    
    .recommendation {
      margin: 15px 0;
      padding: 20px;
      background: white;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .recommendation-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .priority-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 10px;
    }
    
    .high-priority .priority-badge {
      background: #fee2e2;
      color: var(--danger-color);
    }
    
    .medium-priority .priority-badge {
      background: #fef3c7;
      color: var(--warning-color);
    }
    
    .low-priority .priority-badge {
      background: #d1fae5;
      color: var(--success-color);
    }
    
    .recommendation-title {
      font-weight: 600;
      margin: 0;
    }
    
    .recommendation-content {
      margin-top: 10px;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid var(--border-color);
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }
    
    .contact-info {
      margin-top: 20px;
      padding: 20px;
      background: var(--light-bg);
      border-radius: 8px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SEO & WEB PROS</div>
    <h1>SEO Audit Report</h1>
  </div>

  <div class="metadata">
    <div class="metadata-item">
      <span class="metadata-label">Website URL</span>
      <span class="metadata-value">${results.url}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Audit Date</span>
      <span class="metadata-value">${new Date(results.auditDate).toLocaleString()}</span>
    </div>
    <div class="metadata-item">
      <span class="metadata-label">Contact Email</span>
      <span class="metadata-value">${results.email}</span>
    </div>
  </div>

  <div class="score-container">
    <div class="score-label">Overall SEO Score</div>
    <div class="score">${results.score}%</div>
    <div class="score-description">Based on comprehensive analysis of technical, on-page, and performance metrics</div>
  </div>

  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <p>This SEO audit report provides a comprehensive analysis of your website's search engine optimization status. The audit covers technical SEO, on-page optimization, performance metrics, and security aspects. Below you'll find detailed recommendations to improve your website's search engine visibility and user experience.</p>
  </div>

  <div class="section">
    <h2 class="section-title">Performance Metrics</h2>
    ${results.technical?.performance?.score ? `
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${Math.round(results.technical.performance.score)}%</div>
          <div class="metric-label">Page Speed Score</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.technical.performance.metrics.fcp}</div>
          <div class="metric-label">First Contentful Paint</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.technical.performance.metrics.lcp}</div>
          <div class="metric-label">Largest Contentful Paint</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.technical.performance.metrics.cls}</div>
          <div class="metric-label">Cumulative Layout Shift</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.technical.performance.metrics.speed_index}</div>
          <div class="metric-label">Speed Index</div>
        </div>
      </div>
    ` : '<p>Performance metrics not available</p>'}
  </div>

  <div class="section">
    <h2 class="section-title">On-Page SEO Analysis</h2>
    ${results.onPage?.meta ? `
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${results.onPage.meta.title.length}</div>
          <div class="metric-label">Title Length (${results.onPage.meta.title.optimal ? 'Optimal' : 'Needs improvement'})</div>
          <div class="metric-detail">${results.onPage.meta.title.content}</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.onPage.meta.description.length}</div>
          <div class="metric-label">Description Length (${results.onPage.meta.description.optimal ? 'Optimal' : 'Needs improvement'})</div>
          <div class="metric-detail">${results.onPage.meta.description.content || 'Not found'}</div>
        </div>
      </div>
    ` : ''}
    
    ${results.onPage?.headings ? `
      <h3>Heading Structure</h3>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${results.onPage.headings.h1.count}</div>
          <div class="metric-label">H1 Tags</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.onPage.headings.h2.count}</div>
          <div class="metric-label">H2 Tags</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.onPage.headings.h3.count}</div>
          <div class="metric-label">H3 Tags</div>
        </div>
      </div>
    ` : ''}
    
    ${results.onPage?.images ? `
      <h3>Image Optimization</h3>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${results.onPage.images.total}</div>
          <div class="metric-label">Total Images</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${results.onPage.images.missing_alt}</div>
          <div class="metric-label">Images Missing Alt Text</div>
        </div>
      </div>
    ` : ''}
  </div>

  <div class="section">
    <h2 class="section-title">Technical SEO</h2>
    <div class="metric-grid">
      ${results.technical?.robots_txt ? `
        <div class="metric-card">
          <div class="metric-value">${results.technical.robots_txt.exists ? '✓' : '✗'}</div>
          <div class="metric-label">Robots.txt</div>
          <div class="metric-detail">${results.technical.robots_txt.exists ? 'Found' : 'Not found'}</div>
        </div>
      ` : ''}
      ${results.technical?.sitemap ? `
        <div class="metric-card">
          <div class="metric-value">${results.technical.sitemap.exists ? '✓' : '✗'}</div>
          <div class="metric-label">Sitemap.xml</div>
          <div class="metric-detail">${results.technical.sitemap.exists ? 'Found' : 'Not found'}</div>
        </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Security Analysis</h2>
    <div class="metric-grid">
      ${results.security?.https ? `
        <div class="metric-card">
          <div class="metric-value">${results.security.https ? '✓' : '✗'}</div>
          <div class="metric-label">HTTPS</div>
          <div class="metric-detail">${results.security.https ? 'Enabled' : 'Not enabled'}</div>
        </div>
      ` : ''}
      ${results.security?.ssl ? `
        <div class="metric-card">
          <div class="metric-value">${results.security.ssl.valid ? '✓' : '✗'}</div>
          <div class="metric-label">SSL Certificate</div>
          <div class="metric-detail">
            ${results.security.ssl.valid ? 'Valid' : 'Invalid'}
            ${results.security.ssl.valid ? `<br>Expires: ${new Date(results.security.ssl.expires).toLocaleDateString()}` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Recommendations</h2>
    ${results.recommendations && results.recommendations.length > 0 ? 
      results.recommendations.map(rec => `
        <div class="recommendation ${rec.priority}-priority">
          <div class="recommendation-header">
            <span class="priority-badge">${rec.priority.toUpperCase()}</span>
            <h3 class="recommendation-title">${rec.category}</h3>
          </div>
          <div class="recommendation-content">
            <p><strong>Issue:</strong> ${rec.issue}</p>
            <p><strong>Recommendation:</strong> ${rec.recommendation}</p>
          </div>
        </div>
      `).join('') 
      : '<p>No recommendations available</p>'
    }
  </div>

  <div class="contact-info">
    <h3>Need Help Implementing These Recommendations?</h3>
    <p>Our team of SEO experts is ready to help you improve your website's performance.</p>
    <p>Contact us at: <a href="mailto:hello@seowebpros.com">hello@seowebpros.com</a></p>
  </div>

  <div class="footer">
    <p>Generated by SEO & WEB PROS - Professional SEO Audit Tool</p>
    <p>© ${new Date().getFullYear()} SEO & WEB PROS. All rights reserved.</p>
  </div>
</body>
</html>
  `;
} 