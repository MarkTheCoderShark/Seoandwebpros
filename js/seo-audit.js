document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('seoAuditForm');
    const resultsSection = document.getElementById('auditResults');
    const seoScore = document.getElementById('seoScore');
    const pageSpeed = document.getElementById('pageSpeed');
    const mobileFriendly = document.getElementById('mobileFriendly');
    const metaTags = document.getElementById('metaTags');
    const detailedAnalysis = document.getElementById('detailedAnalysis');

    // Add status update function
    function updateStatusIndicator(type, status) {
        const statusElement = document.getElementById(`${type}Status`);
        if (!statusElement) return;

        // Remove existing classes
        statusElement.className = 'w-3 h-3 rounded-full mr-3';

        // Add appropriate color class based on status
        switch (status) {
            case 'pending':
                statusElement.classList.add('bg-gray-500');
                break;
            case 'in_progress':
                statusElement.classList.add('bg-yellow-500', 'animate-pulse');
                break;
            case 'completed':
                statusElement.classList.add('bg-green-500');
                break;
            case 'failed':
                statusElement.classList.add('bg-red-500');
                break;
            default:
                statusElement.classList.add('bg-gray-500');
        }
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const url = document.getElementById('websiteUrl').value;
        const email = document.getElementById('email').value;
        const submitButton = form.querySelector('button');
        
        // Reset and show status indicators
        ['technical', 'onPage', 'security'].forEach(type => {
            updateStatusIndicator(type, 'pending');
        });
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        submitButton.disabled = true;
        
        // Show results section with status indicators
        resultsSection.classList.remove('hidden');
        
        try {
            const response = await fetch('/.netlify/functions/seo-audit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze website');
            }

            // Update status indicators if available
            if (data.status) {
                Object.entries(data.status).forEach(([type, status]) => {
                    updateStatusIndicator(type, status);
                });
            }

            if (data.error) {
                // Handle partial results
                updateResults(data);
                showWarning('Some checks could not be completed: ' + data.error);
            } else {
                // Handle complete results
                updateResults(data);
                // Show email confirmation message
                if (data.message) {
                    showSuccess(data.message);
                }
            }
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });

            // If there's a download URL, show the download button
            if (data.downloadUrl) {
                showDownloadButton(data.downloadUrl);
            }
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Failed to analyze website. Please try again later.');
            
            // Update status indicators to failed state
            ['technical', 'onPage', 'security'].forEach(type => {
                updateStatusIndicator(type, 'failed');
            });
        } finally {
            // Reset button state
            submitButton.innerHTML = 'Start Free Audit';
            submitButton.disabled = false;
        }
    });

    function updateResults(data) {
        // Update score
        seoScore.textContent = data.score || 0;
        
        // Update performance metrics
        if (data.technical?.performance?.score) {
            pageSpeed.textContent = `${Math.round(data.technical.performance.score)}%`;
        } else if (data.technical?.performance?.error) {
            pageSpeed.textContent = 'N/A';
            pageSpeed.title = data.technical.performance.details || 'Performance metrics unavailable';
        }
        
        // Update mobile friendly status with LCP interpretation
        if (data.technical?.performance?.metrics?.lcp) {
            const lcp = data.technical.performance.metrics.lcp;
            const lcpValue = parseFloat(lcp);
            let status = '';
            let statusClass = '';
            
            if (lcpValue <= 2.5) {
                status = 'Good';
                statusClass = 'text-emerald-400';
            } else if (lcpValue <= 4.0) {
                status = 'Needs Improvement';
                statusClass = 'text-yellow-400';
            } else {
                status = 'Poor';
                statusClass = 'text-red-400';
            }
            
            mobileFriendly.textContent = lcp;
            const statusElement = document.getElementById('mobileFriendlyStatus');
            statusElement.textContent = `${status} - Largest Contentful Paint`;
            statusElement.className = `mt-2 text-sm ${statusClass}`;
        } else {
            mobileFriendly.textContent = 'N/A';
            document.getElementById('mobileFriendlyStatus').textContent = '';
        }
        
        // Update meta tags status
        if (data.onPage?.meta?.title?.optimal !== undefined) {
            metaTags.textContent = data.onPage.meta.title.optimal ? 'Optimized' : 'Needs Improvement';
            metaTags.className = data.onPage.meta.title.optimal ? 'text-emerald-400' : 'text-yellow-400';
        } else {
            metaTags.textContent = 'N/A';
        }
        
        // Update detailed analysis
        detailedAnalysis.innerHTML = '';
        
        // Add recommendations
        if (data.recommendations && data.recommendations.length > 0) {
            data.recommendations.forEach(rec => {
                const priorityClass = rec.priority === 'high' ? 'text-red-400' : 'text-yellow-400';
                const recElement = document.createElement('div');
                recElement.className = 'bg-gray-700 rounded-lg p-4 mb-4';
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
        } else {
            detailedAnalysis.innerHTML = '<p class="text-gray-400">No recommendations available</p>';
        }
        
        // Show download button if URL is available
        if (data.downloadUrl) {
            const downloadContainer = document.getElementById('download-container');
            downloadContainer.innerHTML = `
                <a href="${data.downloadUrl}" class="inline-block bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition duration-300 glow">
                    <i class="fas fa-download mr-2"></i>
                    Download Full Report
                </a>
            `;
        }
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-900 text-white p-4 rounded-lg mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        resultsSection.insertBefore(errorDiv, resultsSection.firstChild);
        resultsSection.classList.remove('hidden');
    }

    function showWarning(message) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'bg-yellow-900 text-white p-4 rounded-lg mb-4';
        warningDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        resultsSection.insertBefore(warningDiv, resultsSection.firstChild);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-emerald-900 text-white p-4 rounded-lg mb-4';
        successDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        resultsSection.insertBefore(successDiv, resultsSection.firstChild);
    }

    function showDownloadButton(downloadUrl) {
        const downloadContainer = document.getElementById('download-container');
        if (!downloadContainer) {
            const container = document.createElement('div');
            container.id = 'download-container';
            container.className = 'download-container';
            document.querySelector('.results-container').appendChild(container);
        }

        const downloadButton = document.createElement('a');
        downloadButton.href = downloadUrl;
        downloadButton.className = 'download-button';
        downloadButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8A8 8 0 0 1 0 8a8 8 0 0 1 8-8zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
            </svg>
            Download Full Report
        `;
        downloadButton.download = 'seo-audit-report.html';
        
        const container = document.getElementById('download-container');
        container.innerHTML = '';
        container.appendChild(downloadButton);
    }
}); 