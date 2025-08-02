// Professional SEO & Web Pros - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeCounterAnimations();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Professional animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card, .service-card, .testimonial-card, .result-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Hero section animations
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-actions, .hero-stats');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
        el.classList.add('animate-fade-in-up');
    });
}

// Professional counter animations
function initializeCounterAnimations() {
    const counterElements = document.querySelectorAll('[data-value]');
    console.log('Found counter elements:', counterElements.length);
    
    // Helper function to animate counter
    function animateCounter(element, targetValue) {
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = progress * targetValue;
            
            if (element.id === 'score-percentage') {
                element.textContent = Math.round(currentValue) + '%';
            } else if (element.id === 'traffic-count') {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.round(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (element.id === 'score-percentage') {
                    element.textContent = Math.round(targetValue) + '%';
                } else if (element.id === 'traffic-count') {
                    element.textContent = targetValue.toFixed(1);
                } else {
                    element.textContent = Math.round(targetValue);
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = parseFloat(element.getAttribute('data-value'));
                console.log('Starting counter animation for:', element, 'target:', targetValue);
                animateCounter(element, targetValue);
                counterObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(element => {
        counterObserver.observe(element);
    });
    
    // Fallback: Start animations after a delay if they haven't started
    setTimeout(() => {
        counterElements.forEach(element => {
            if (element.textContent === '0' || element.textContent === '0%' || element.textContent === '0+') {
                const targetValue = parseFloat(element.getAttribute('data-value'));
                console.log('Fallback animation for:', element, 'target:', targetValue);
                animateCounter(element, targetValue);
            }
        });
    }, 1000);
    
    // Progress bar animation
    const progressBar = document.getElementById('score-bar');
    if (progressBar) {
        const progressObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.width = '85%';
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        progressObserver.observe(progressBar);
    }
}

// Professional form handling
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Professional notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="ml-2 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Professional scroll effects
function initializeScrollEffects() {
    // Navbar background on scroll
    const navbar = document.querySelector('.nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                navbar.style.backdropFilter = 'blur(12px)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.backdropFilter = 'blur(12px)';
            }
        });
    }
}

// Professional utility functions
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

// Throttle function for performance
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

// Professional error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting service here
});

// Professional performance monitoring
window.addEventListener('load', function() {
    // Log page load performance
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});

// Export functions for global access
window.showNotification = showNotification; 