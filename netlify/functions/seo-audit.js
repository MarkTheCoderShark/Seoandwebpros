const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const crypto = require('crypto');

// In-memory storage for audit results (will reset on function cold start)
const auditResults = new Map();

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
    console.log('Received request:', event.body);

    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { url, email } = JSON.parse(event.body);
    
    if (!url) {
      throw new Error('URL is required');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate URL format
    new URL(url);

    console.log('Starting SEO audit for:', url, 'Email:', email);
    const results = await performSEOAudit(url);
    
    // Add metadata to results
    results.email = email;
    results.auditDate = new Date().toISOString();
    results.url = url;
    
    // Generate a unique ID for the audit
    const auditId = crypto.randomBytes(16).toString('hex');
    
    // Store the results
    auditResults.set(auditId, results);
    
    console.log('Audit completed successfully');
    
    // Return results with download information
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...results,
        auditId,
        downloadUrl: `/.netlify/functions/download-audit?auditId=${auditId}`,
        message: 'Audit completed successfully. You can download the full report using the button below.'
      })
    };
  } catch (error) {
    console.error('Error in handler:', error);
    
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

// Export the auditResults map for the download function
exports.auditResults = auditResults;

async function performSEOAudit(url) {
  console.log('Starting performSEOAudit');
  
  // Initialize with default structure matching frontend expectations
  const results = {
    score: 0,
    technical: {
      performance: {
        score: 0,
        metrics: {}
      }
    },
    onPage: {
      meta: {
        title: { optimal: false },
        description: { optimal: false }
      }
    },
    security: {},
    recommendations: []
  };

  try {
    // Run checks sequentially to avoid timeout issues
    await checkTechnicalSEO(url, results);
    await checkOnPageSEO(url, results);
    await checkSecurity(url, results);
    
    calculateScore(results);
    generateRecommendations(results);

    return results;
  } catch (error) {
    console.error('Audit error:', error);
    // Return partial results instead of throwing
    return {
      ...results,
      error: error.message
    };
  }
}

async function checkTechnicalSEO(url, results) {
  try {
    // PageSpeed Insights API
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${process.env.GOOGLE_API_KEY}`;
    const pageSpeedData = await axios.get(pageSpeedUrl);
    
    if (pageSpeedData.data && pageSpeedData.data.lighthouseResult) {
      results.technical.performance = {
        score: pageSpeedData.data.lighthouseResult.categories.performance.score * 100,
        metrics: {
          fcp: pageSpeedData.data.lighthouseResult.audits['first-contentful-paint'].displayValue,
          lcp: pageSpeedData.data.lighthouseResult.audits['largest-contentful-paint'].displayValue,
          cls: pageSpeedData.data.lighthouseResult.audits['cumulative-layout-shift'].displayValue,
          speed_index: pageSpeedData.data.lighthouseResult.audits['speed-index'].displayValue
        }
      };
    } else {
      throw new Error('Invalid PageSpeed API response');
    }
  } catch (error) {
    console.error('PageSpeed API error:', error);
    results.technical.performance = {
      error: 'Could not fetch performance metrics',
      details: error.message
    };
  }

  // Check robots.txt
  try {
    const robotsUrl = new URL('/robots.txt', url).href;
    const robotsResponse = await axios.get(robotsUrl);
    results.technical.robots_txt = {
      exists: true,
      content: robotsResponse.data
    };
  } catch (error) {
    results.technical.robots_txt = {
      exists: false,
      error: 'robots.txt not found'
    };
  }

  // Check sitemap.xml
  try {
    const sitemapUrl = new URL('/sitemap.xml', url).href;
    const sitemapResponse = await axios.get(sitemapUrl);
    results.technical.sitemap = {
      exists: true,
      valid: sitemapResponse.headers['content-type'].includes('xml')
    };
  } catch (error) {
    results.technical.sitemap = {
      exists: false,
      error: 'sitemap.xml not found'
    };
  }
}

async function checkOnPageSEO(url, results) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Meta Tags Analysis
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    
    results.onPage.meta = {
      title: {
        content: title,
        length: title.length,
        optimal: title.length >= 50 && title.length <= 60
      },
      description: {
        content: description,
        length: description.length,
        optimal: description.length >= 120 && description.length <= 160
      },
      viewport: $('meta[name="viewport"]').length > 0,
      canonical: $('link[rel="canonical"]').attr('href'),
      robots: $('meta[name="robots"]').attr('content')
    };

    // Heading Structure
    results.onPage.headings = {
      h1: {
        count: $('h1').length,
        items: $('h1').map((i, el) => $(el).text()).get()
      },
      h2: {
        count: $('h2').length,
        items: $('h2').map((i, el) => $(el).text()).get()
      },
      h3: {
        count: $('h3').length
      }
    };

    // Image Analysis
    const images = $('img');
    results.onPage.images = {
      total: images.length,
      missing_alt: images.filter((i, el) => !$(el).attr('alt')).length,
      large_images: images.filter((i, el) => {
        const src = $(el).attr('src');
        return src && (src.includes('.jpg') || src.includes('.png') || src.includes('.gif'));
      }).length
    };
  } catch (error) {
    console.error('On-page analysis error:', error);
    results.onPage.error = 'Could not analyze page content';
  }
}

async function checkSecurity(url, results) {
  try {
    // Check HTTPS
    const parsedUrl = new URL(url);
    results.security.https = parsedUrl.protocol === 'https:';

    // Check SSL Certificate
    if (results.security.https) {
      try {
        const sslDetails = await checkSSL(parsedUrl.hostname);
        results.security.ssl = sslDetails;
      } catch (error) {
        results.security.ssl = {
          valid: false,
          error: error.message
        };
      }
    }

    // Security Headers
    const response = await axios.get(url);
    results.security.headers = {
      'x-frame-options': response.headers['x-frame-options'] || 'missing',
      'x-content-type-options': response.headers['x-content-type-options'] || 'missing',
      'strict-transport-security': response.headers['strict-transport-security'] || 'missing',
      'content-security-policy': response.headers['content-security-policy'] || 'missing'
    };
  } catch (error) {
    console.error('Security check error:', error);
    results.security.error = 'Could not complete security checks';
  }
}

function checkSSL(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: 443,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      resolve({
        valid: true,
        expires: new Date(cert.valid_to),
        issuer: cert.issuer.CN
      });
    });

    req.on('error', (error) => {
      reject({
        valid: false,
        error: error.message
      });
    });

    req.end();
  });
}

function calculateScore(results) {
  let score = 0;
  
  // Technical Score (40%)
  if (results.technical.performance?.score) {
    score += results.technical.performance.score * 0.2;
  }
  if (results.technical.robots_txt?.exists) score += 10;
  if (results.technical.sitemap?.exists) score += 10;

  // On-Page Score (40%)
  if (results.onPage.meta?.title?.optimal) score += 10;
  if (results.onPage.meta?.description?.optimal) score += 10;
  if (results.onPage.headings?.h1?.count === 1) score += 10;
  if (results.onPage.images?.missing_alt === 0) score += 10;

  // Security Score (20%)
  if (results.security.https) score += 10;
  if (results.security.ssl?.valid) score += 10;

  results.score = Math.round(score);
}

function generateRecommendations(results) {
  const recs = [];

  // Technical Recommendations
  if (results.technical.performance?.score < 90) {
    recs.push({
      priority: 'high',
      category: 'Performance',
      issue: 'Poor page speed performance',
      recommendation: 'Optimize images, minimize CSS/JS, leverage browser caching'
    });
  }

  // Meta Tags Recommendations
  if (!results.onPage.meta?.title?.optimal) {
    recs.push({
      priority: 'high',
      category: 'Meta Tags',
      issue: 'Title tag length is not optimal',
      recommendation: 'Adjust title length to be between 50-60 characters'
    });
  }

  if (!results.onPage.meta?.description?.optimal) {
    recs.push({
      priority: 'high',
      category: 'Meta Tags',
      issue: 'Meta description length is not optimal',
      recommendation: 'Adjust meta description length to be between 120-160 characters'
    });
  }

  // Heading Structure Recommendations
  if (results.onPage.headings?.h1?.count !== 1) {
    recs.push({
      priority: 'high',
      category: 'Content Structure',
      issue: `Found ${results.onPage.headings.h1.count} H1 tags`,
      recommendation: 'Use exactly one H1 tag per page for proper content hierarchy'
    });
  }

  // Image Optimization Recommendations
  if (results.onPage.images?.missing_alt > 0) {
    recs.push({
      priority: 'medium',
      category: 'Accessibility',
      issue: `${results.onPage.images.missing_alt} images missing alt text`,
      recommendation: 'Add descriptive alt text to all images for better accessibility and SEO'
    });
  }

  // Security Recommendations
  if (!results.security.https) {
    recs.push({
      priority: 'high',
      category: 'Security',
      issue: 'Website not using HTTPS',
      recommendation: 'Install SSL certificate and enforce HTTPS'
    });
  }

  results.recommendations = recs;
} 