// Optimized SEO & Web Pros - Main JavaScript
// Performance optimized with lazy loading and efficient event handling

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for navigation links with debouncing
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Optimized animations with Intersection Observer
function initializeAnimations() {
    // Use Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, observerOptions);
    
    // Observe elements efficiently
    const animatedElements = document.querySelectorAll('.card, .service-card, .testimonial-card, .result-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Hero animations with staggered timing
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-actions, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.15}s`;
        el.classList.add('animate-fade-in-up');
    });
}

// Optimized counter animations
function initializeCounterAnimations() {
    const counterElements = document.querySelectorAll('[data-value]');
    
    if (counterElements.length === 0) return;
    
    // Helper function to animate counter
    function animateCounter(element, targetValue) {
        const duration = 1500; // Reduced duration for better performance
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Use easeOutQuart for smooth animation
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(targetValue * easeProgress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Intersection Observer for counter animations
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseInt(element.getAttribute('data-value')) || 0;
                
                animateCounter(element, targetValue);
                counterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => counterObserver.observe(el));
}

// Optimized form handling
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }, 1000);
        });
    });
}

// Optimized notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => notification.remove());
    }
}

// Optimized scroll effects with throttling
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        // Add scroll-based effects here if needed
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

// Modal functionality for website submission
function initializeModal() {
    const modal = document.getElementById('noWebsiteModal');
    const noWebsiteLink = document.getElementById('noWebsiteLink');
    const closeModal = document.getElementById('closeModal');
    const websiteForm = document.querySelector('.website-submission-form');
    const proposalForm = document.getElementById('proposalForm');
    
    console.log('Modal elements found:', { modal, noWebsiteLink, closeModal, websiteForm, proposalForm });
    
    if (!modal || !noWebsiteLink || !closeModal) {
        console.log('Some modal elements not found, retrying...');
        return;
    }
    
    // Open modal when "Don't have a site?" is clicked
    noWebsiteLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('No website link clicked!');
        // Hide website field for users without websites
        const websiteField = document.getElementById('websiteField');
        if (websiteField) websiteField.style.display = 'none';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
    
    // Function to close modal and clean up
    function closeModalAndCleanup() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        localStorage.removeItem('submittedWebsite'); // Clear stored website
    }
    
    // Close modal when X button is clicked
    closeModal.addEventListener('click', closeModalAndCleanup);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalAndCleanup();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModalAndCleanup();
        }
    });
    
    // Handle website submission form
    if (websiteForm) {
        websiteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const websiteUrl = document.getElementById('websiteUrl').value;
            
            if (!websiteUrl) {
                showNotification('Please enter your website URL', 'error');
                return;
            }
            
            // Validate URL format
            try {
                new URL(websiteUrl);
            } catch {
                showNotification('Please enter a valid website URL', 'error');
                return;
            }
            
            // Store the website URL and show the modal form
            localStorage.setItem('submittedWebsite', websiteUrl);
            
            // Show website field and populate it
            const websiteField = document.getElementById('websiteField');
            const submittedWebsiteInput = document.getElementById('submittedWebsite');
            if (websiteField && submittedWebsiteInput) {
                websiteField.style.display = 'block';
                submittedWebsiteInput.value = websiteUrl;
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Reset the website form
            websiteForm.reset();
        });
    }
    
    // Handle proposal form submission
    if (proposalForm) {
        proposalForm.addEventListener('submit', function(e) {
            const submitBtn = proposalForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Let Netlify handle the form submission
            // The form will be processed automatically by Netlify
            // and you'll receive notifications in your Netlify dashboard
            
            setTimeout(() => {
                showNotification('Thank you! We\'ll be in touch with your custom proposal within 24 hours.', 'success');
                proposalForm.reset();
                closeModalAndCleanup();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Initialize modal when DOM is ready
function initializeModalWithRetry() {
    const modal = document.getElementById('noWebsiteModal');
    const noWebsiteLink = document.getElementById('noWebsiteLink');
    
    if (!modal || !noWebsiteLink) {
        console.log('Modal elements not found, retrying in 100ms...');
        setTimeout(initializeModalWithRetry, 100);
        return;
    }
    
    initializeModal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModalWithRetry);
} else {
    initializeModalWithRetry();
} 