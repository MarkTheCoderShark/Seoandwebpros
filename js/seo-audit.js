class SEOAudit {
    constructor() {
        this.form = document.getElementById('seoAuditForm');
        this.resultsSection = document.getElementById('auditResults');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const url = document.getElementById('websiteUrl').value;
        const email = document.getElementById('email').value;

        // Show loading state
        this.showLoading();

        try {
            // Perform the audit
            const results = await this.performAudit(url);
            
            // Display results
            this.displayResults(results);
            
            // Send results to email
            await this.sendResultsEmail(email, results);
        } catch (error) {
            this.showError(error.message);
        }
    }

    showLoading() {
        this.form.querySelector('button').textContent = 'Analyzing...';
        this.form.querySelector('button').disabled = true;
    }

    async performAudit(url) {
        // Perform various SEO checks
        const results = {
            score: 0,
            checks: []
        };

        // Check 1: SSL Certificate
        if (url.startsWith('https://')) {
            results.checks.push({
                name: 'SSL Certificate',
                status: 'pass',
                message: 'Your website is secure with HTTPS'
            });
            results.score += 10;
        } else {
            results.checks.push({
                name: 'SSL Certificate',
                status: 'fail',
                message: 'Your website is not secure. Consider adding HTTPS'
            });
        }

        // Fetch the webpage
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Check 2: Meta Title
            const metaTitle = doc.querySelector('title');
            if (metaTitle && metaTitle.textContent.length > 0) {
                const titleLength = metaTitle.textContent.length;
                if (titleLength >= 50 && titleLength <= 60) {
                    results.checks.push({
                        name: 'Meta Title',
                        status: 'pass',
                        message: 'Meta title has optimal length'
                    });
                    results.score += 10;
                } else {
                    results.checks.push({
                        name: 'Meta Title',
                        status: 'warning',
                        message: `Meta title length (${titleLength}) is not optimal (50-60 chars)`
                    });
                    results.score += 5;
                }
            } else {
                results.checks.push({
                    name: 'Meta Title',
                    status: 'fail',
                    message: 'Meta title is missing'
                });
            }

            // Check 3: Meta Description
            const metaDesc = doc.querySelector('meta[name="description"]');
            if (metaDesc && metaDesc.getAttribute('content')) {
                const descLength = metaDesc.getAttribute('content').length;
                if (descLength >= 120 && descLength <= 160) {
                    results.checks.push({
                        name: 'Meta Description',
                        status: 'pass',
                        message: 'Meta description has optimal length'
                    });
                    results.score += 10;
                } else {
                    results.checks.push({
                        name: 'Meta Description',
                        status: 'warning',
                        message: `Meta description length (${descLength}) is not optimal (120-160 chars)`
                    });
                    results.score += 5;
                }
            } else {
                results.checks.push({
                    name: 'Meta Description',
                    status: 'fail',
                    message: 'Meta description is missing'
                });
            }

            // Check 4: Headings
            const h1s = doc.querySelectorAll('h1');
            if (h1s.length === 1) {
                results.checks.push({
                    name: 'H1 Heading',
                    status: 'pass',
                    message: 'Page has exactly one H1 heading'
                });
                results.score += 10;
            } else {
                results.checks.push({
                    name: 'H1 Heading',
                    status: 'fail',
                    message: `Page has ${h1s.length} H1 headings (should have exactly 1)`
                });
            }

            // Check 5: Image Alt Tags
            const images = doc.querySelectorAll('img');
            const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'));
            const altPercentage = (imagesWithAlt.length / images.length) * 100 || 0;

            if (altPercentage === 100) {
                results.checks.push({
                    name: 'Image Alt Tags',
                    status: 'pass',
                    message: 'All images have alt tags'
                });
                results.score += 10;
            } else {
                results.checks.push({
                    name: 'Image Alt Tags',
                    status: 'warning',
                    message: `${Math.round(altPercentage)}% of images have alt tags`
                });
                results.score += Math.round(altPercentage / 10);
            }

        } catch (error) {
            results.checks.push({
                name: 'Website Accessibility',
                status: 'fail',
                message: 'Unable to access website. Please check the URL and try again.'
            });
        }

        return results;
    }

    displayResults(results) {
        // Reset loading state
        this.form.querySelector('button').textContent = 'Start Free Audit';
        this.form.querySelector('button').disabled = false;

        // Show results section
        this.resultsSection.classList.remove('hidden');

        // Update score
        const scoreElement = document.getElementById('seoScore');
        scoreElement.textContent = results.score;
        scoreElement.parentElement.style.setProperty('--percentage', `${results.score}%`);

        // Update detailed analysis
        const detailedAnalysis = document.getElementById('detailedAnalysis');
        detailedAnalysis.innerHTML = results.checks.map(check => `
            <div class="check-item ${check.status}">
                <h4>${check.name}</h4>
                <p>${check.message}</p>
            </div>
        `).join('');
    }

    async sendResultsEmail(email, results) {
        // In a real implementation, this would send the results to your backend
        // which would then email the results to the user
        console.log('Sending results to:', email);
    }

    showError(message) {
        // Reset loading state
        this.form.querySelector('button').textContent = 'Start Free Audit';
        this.form.querySelector('button').disabled = false;

        // Show error message
        alert(message);
    }
}

// Initialize the SEO Audit tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SEOAudit();
}); 