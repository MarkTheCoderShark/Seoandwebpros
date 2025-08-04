// Optimized SEO & Web Pros - Main JavaScript
// Performance optimized with lazy loading and efficient event handling

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    }
    
    // Desktop Solutions Dropdown
    const solutionsDropdown = document.getElementById('solutionsDropdown');
    const solutionsDropdownMenu = document.getElementById('solutionsDropdownMenu');
    
    if (solutionsDropdown && solutionsDropdownMenu) {
        solutionsDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            solutionsDropdown.classList.toggle('active');
            solutionsDropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!solutionsDropdown.contains(e.target) && !solutionsDropdownMenu.contains(e.target)) {
                solutionsDropdown.classList.remove('active');
                solutionsDropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Mobile Solutions Dropdown
    const mobileSolutionsDropdown = document.getElementById('mobileSolutionsDropdown');
    const mobileSolutionsDropdownMenu = document.getElementById('mobileSolutionsDropdownMenu');
    
    if (mobileSolutionsDropdown && mobileSolutionsDropdownMenu) {
        mobileSolutionsDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            mobileSolutionsDropdownMenu.classList.toggle('show');
            
            if (mobileSolutionsDropdownMenu.classList.contains('show')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Smooth scrolling for navigation links with debouncing
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Skip if targetId is just "#" (invalid selector)
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
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

// Form handling with Resend
function initializeFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            if (submitButton) {
                submitButton.disabled = true;
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
            }
            
            try {
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formName: form.getAttribute('name') || form.id || 'Contact Form',
                        formData: formDataObj
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
                
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                // If this is the proposal form in the modal, close it
                if (form.id === 'proposalForm') {
                    closeModalAndCleanup();
                }
            } catch (error) {
                console.error('Error sending form:', error);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
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
        console.log('Website form found, adding event listener');
        websiteForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Website form submitted');
            
            let websiteUrl = document.getElementById('websiteUrl').value.trim();
            // Auto-prepend scheme if missing so the URL input is always valid
            if (websiteUrl && !/^(https?:\/\/)/i.test(websiteUrl)) {
                websiteUrl = 'https://' + websiteUrl;
                // reflect the formatted value back into the input so the user sees it
                document.getElementById('websiteUrl').value = websiteUrl;
            }
            console.log('Website URL:', websiteUrl);
            
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
            
            // Silently submit the website URL to Resend
            try {
                await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formName: 'Website Submission',
                        formData: { website: websiteUrl }
                    })
                });
            } catch (error) {
                console.error('Error sending website submission:', error);
                // Silently handle error - don't show to user
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
    } else {
        console.log('Website form not found');
    }
    
    // Handle consultation buttons (Free Consultation buttons in navigation)
    const desktopConsultationBtn = document.getElementById('desktopConsultationBtn');
    const mobileConsultationBtn = document.getElementById('mobileConsultationBtn');
    
    function openConsultationModal() {
        // Hide website field for direct consultation
        const websiteField = document.getElementById('websiteField');
        if (websiteField) websiteField.style.display = 'none';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    if (desktopConsultationBtn) {
        desktopConsultationBtn.addEventListener('click', openConsultationModal);
    }
    
    if (mobileConsultationBtn) {
        mobileConsultationBtn.addEventListener('click', openConsultationModal);
    }
    
    // Handle proposal form submission
    if (proposalForm) {
        console.log('Proposal form found, adding event listener');
        proposalForm.addEventListener('submit', function(e) {
            console.log('Proposal form submitted');
            
            const submitBtn = proposalForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Let the form submit naturally to Netlify
            // Don't prevent default - let Netlify handle it
            console.log('Form data being submitted to Netlify');
            
            // Don't reset or close modal immediately - let Netlify handle the submission
            // The form will redirect to a success page or show a success message
        });
        
        // Add phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
                
                // Don't format if empty
                if (value.length === 0) {
                    e.target.value = '';
                    return;
                }
                
                // Format based on length
                if (value.length <= 3) {
                    // Just show the area code
                    value = value;
                } else if (value.length <= 6) {
                    // Show area code and first 3 digits
                    value = value.substring(0, 3) + '-' + value.substring(3);
                } else {
                    // Full format: XXX-XXX-XXXX
                    value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
                }
                
                e.target.value = value;
            });
            
            // Handle backspace to maintain formatting
            phoneInput.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace') {
                    const value = e.target.value;
                    const cursorPosition = e.target.selectionStart;
                    
                    // If cursor is at a dash, move it back
                    if (value[cursorPosition - 1] === '-') {
                        e.preventDefault();
                        e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                    }
                }
            });
        }
    } else {
        console.log('Proposal form not found');
    }
}

// Cursor avoidance for floating shapes
function initializeCursorAvoidance() {
    const shapes = document.querySelectorAll('.floating-shape');
    const hero = document.querySelector('.hero');
    
    if (!hero || shapes.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout;
    
    // Track mouse position
    hero.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        // Clear previous timeout
        clearTimeout(mouseTimeout);
        
        // Set timeout to stop avoidance after mouse stops moving
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
            shapes.forEach(shape => {
                shape.classList.remove('cursor-avoid');
                shape.style.transform = '';
            });
        }, 1000);
        
        // Calculate avoidance for each shape
        shapes.forEach(shape => {
            const rect = shape.getBoundingClientRect();
            const shapeCenterX = rect.left + rect.width / 2;
            const shapeCenterY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to shape center
            const distanceX = mouseX - shapeCenterX;
            const distanceY = mouseY - shapeCenterY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // Avoid if mouse is within 150px of shape
            if (distance < 150) {
                shape.classList.add('cursor-avoid');
                
                // Calculate avoidance direction (opposite to mouse)
                const avoidX = -distanceX / distance * 30;
                const avoidY = -distanceY / distance * 30;
                
                // Apply avoidance transform
                shape.style.transform = `translate(${avoidX}px, ${avoidY}px)`;
            } else {
                shape.classList.remove('cursor-avoid');
                shape.style.transform = '';
            }
        });
    });
    
    // Reset shapes when mouse leaves hero area
    hero.addEventListener('mouseleave', function() {
        isMouseMoving = false;
        shapes.forEach(shape => {
            shape.classList.remove('cursor-avoid');
            shape.style.transform = '';
        });
    });
}

// Initialize modal when DOM is ready
function initializeModalWithRetry() {
    const modal = document.getElementById('noWebsiteModal');
    const noWebsiteLink = document.getElementById('noWebsiteLink');
    const websiteForm = document.getElementById('websiteForm');
    
    console.log('Checking for modal elements:', { modal, noWebsiteLink, websiteForm });
    
    if (!modal || !noWebsiteLink || !websiteForm) {
        console.log('Some modal elements not found, retrying in 100ms...');
        setTimeout(initializeModalWithRetry, 100);
        return;
    }
    
    console.log('All modal elements found, initializing...');
    initializeModal();
}

// Initialize everything when DOM is ready
function initializeAll() {
    initializeNavigation();
    initializeAnimations();
    initializeCounterAnimations();
    initializeFormHandling();
    initializeScrollEffects();
    initializeCursorAvoidance();
    initializeModalWithRetry();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
} 