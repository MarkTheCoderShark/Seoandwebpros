// Function to load a component
async function loadComponent(componentId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(componentId).innerHTML = html;
        console.log(`Loaded component: ${componentId}`);
    } catch (error) {
        console.error(`Error loading ${componentId}:`, error);
    }
}

// Load all components and initialize JavaScript after
document.addEventListener('DOMContentLoaded', async () => {
    // Calculate relative path to components directory
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const componentsPath = '../'.repeat(pathSegments.length) + 'components/';
    
    // Load critical components first
    await loadComponent('navigation', componentsPath + 'navigation.html');
    
    // Load footer
    await loadComponent('footer', componentsPath + 'footer.html');
    
    // Initialize JavaScript after components are loaded
    if (typeof initializeNavigation === 'function') initializeNavigation();
    if (typeof initializeAnimations === 'function') initializeAnimations();
    if (typeof initializeFormHandling === 'function') initializeFormHandling();
}); 

// Animation observer for fade-up elements
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.fade-up').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// FAQ Toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.querySelector('.faq-answer').classList.remove('active');
            item.querySelector('.faq-icon').classList.remove('active');
        }
    });
    
    answer.classList.toggle('active');
    icon.classList.toggle('active');
}

// Contact Form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
                    form.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initContactForm();
}); 