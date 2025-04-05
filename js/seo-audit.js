document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('seoAuditForm');
    const resultsSection = document.getElementById('auditResults');
    const seoScore = document.getElementById('seoScore');
    const pageSpeed = document.getElementById('pageSpeed');
    const mobileFriendly = document.getElementById('mobileFriendly');
    const metaTags = document.getElementById('metaTags');
    const detailedAnalysis = document.getElementById('detailedAnalysis');

    let latestAuditResults = null;

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
        const originalButtonText = submitButton.innerHTML;
        
        // Basic validation
        if (!url || !url.trim()) {
            showError('Please enter a valid URL');
            return;
        }
        if (!email || !email.trim()) {
            showError('Please enter your email address');
            return;
        }
        
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
                body: JSON.stringify({ 
                    url: url.trim(),
                    email: email.trim() 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze website');
            }

            // Store the latest results
            latestAuditResults = data;

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

            // Show download button
            showDownloadButton();
        } catch (error) {
            console.error('Error:', error);
            showError(error.message || 'Failed to analyze website. Please try again later.');
            
            // Update status indicators to failed state
            ['technical', 'onPage', 'security'].forEach(type => {
                updateStatusIndicator(type, 'failed');
            });
        } finally {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
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
                <button class="download-button">Download Full Report</button>
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

    function showDownloadButton() {
        const downloadContainer = document.getElementById('download-container');
        if (!downloadContainer) {
            const container = document.createElement('div');
            container.id = 'download-container';
            container.className = 'download-container';
            document.querySelector('.results-container').appendChild(container);
        }

        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '<i class="fas fa-download mr-2"></i>Download Full Report';
        downloadButton.className = 'inline-block bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition duration-300 glow download-button';

        downloadButton.addEventListener('click', async () => {
            try {
                if (!latestAuditResults) {
                    throw new Error('No audit results available');
                }

                downloadButton.disabled = true;
                downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Preparing Download...';
                
                const res = await fetch("/api/download-audit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(latestAuditResults)
                });

                if (!res.ok) throw new Error('Download failed');

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'seo-audit-report.html';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                alert('Failed to download the report. Please try again.');
                console.error('Download error:', err);
            } finally {
                downloadButton.disabled = false;
                downloadButton.innerHTML = '<i class="fas fa-download mr-2"></i>Download Full Report';
            }
        });

        const container = document.getElementById('download-container');
        container.innerHTML = '';
        container.appendChild(downloadButton);
    }
}); 