document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('seoAuditForm');
    const resultsSection = document.getElementById('auditResults');
    const seoScore = document.getElementById('seoScore');
    const pageSpeed = document.getElementById('pageSpeed');
    const mobileFriendly = document.getElementById('mobileFriendly');
    const metaTags = document.getElementById('metaTags');
    const detailedAnalysis = document.getElementById('detailedAnalysis');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = document.getElementById('websiteUrl').value;
        const email = document.getElementById('email').value;

        // Show loading state
        form.querySelector('button').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        form.querySelector('button').disabled = true;

        try {
            const response = await fetch('/.netlify/functions/seo-audit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze website');
            }

            const data = await response.json();
            
            // Update UI with results
            updateResults(data);
            
            // Show results section
            resultsSection.classList.remove('hidden');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to analyze website. Please try again later.');
        } finally {
            // Reset button state
            form.querySelector('button').innerHTML = 'Start Free Audit';
            form.querySelector('button').disabled = false;
        }
    });

    function updateResults(data) {
        // Update score
        seoScore.textContent = data.score;
        
        // Update performance metrics
        if (data.technical.performance?.score) {
            pageSpeed.textContent = `${data.technical.performance.score}%`;
        }
        
        // Update mobile friendly status
        if (data.technical.performance?.metrics) {
            const metrics = data.technical.performance.metrics;
            mobileFriendly.textContent = `LCP: ${metrics.lcp}`;
        }
        
        // Update meta tags status
        if (data.onPage.meta) {
            const meta = data.onPage.meta;
            metaTags.textContent = meta.title.optimal ? 'Optimized' : 'Needs Improvement';
        }
        
        // Update detailed analysis
        detailedAnalysis.innerHTML = '';
        
        // Add recommendations
        data.recommendations.forEach(rec => {
            const priorityClass = rec.priority === 'high' ? 'text-red-400' : 'text-yellow-400';
            const recElement = document.createElement('div');
            recElement.className = 'bg-gray-700 rounded-lg p-4';
            recElement.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas ${rec.priority === 'high' ? 'fa-exclamation-circle' : 'fa-info-circle'} ${priorityClass}"></i>
                    </div>
                    <div class="ml-3">
                        <h4 class="text-lg font-medium text-white">${rec.category}</h4>
                        <p class="text-gray-300 mt-1">${rec.issue}</p>
                        <p class="text-emerald-400 mt-2">${rec.recommendation}</p>
                    </div>
                </div>
            `;
            detailedAnalysis.appendChild(recElement);
        });
    }
}); 