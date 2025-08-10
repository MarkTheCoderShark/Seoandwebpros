// Initialize all JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandling();
    initializeCounterAnimations();
    initializeScrollEffects();
    // Enable alternating section backgrounds sitewide
    document.body.classList.add('alt-sections');
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            
            // Toggle hamburger icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars';
                } else {
                    icon.className = 'fas fa-times';
                }
            }
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.add('hidden');
            
            // Reset hamburger icon
            const mobileMenuButtonIcon = mobileMenuButton?.querySelector('i');
            if (mobileMenuButtonIcon) {
                mobileMenuButtonIcon.className = 'fas fa-bars';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnButton = mobileMenuButton && mobileMenuButton.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnButton) {
                mobileMenu.classList.add('hidden');
                
                // Reset hamburger icon
                const mobileMenuButtonIcon = mobileMenuButton?.querySelector('i');
                if (mobileMenuButtonIcon) {
                    mobileMenuButtonIcon.className = 'fas fa-bars';
                }
            }
        }
    });

    // Close mobile menu when a link is clicked
    if (mobileMenu) {
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                
                // Reset hamburger icon
                const mobileMenuButtonIcon = mobileMenuButton?.querySelector('i');
                if (mobileMenuButtonIcon) {
                    mobileMenuButtonIcon.className = 'fas fa-bars';
                }
            });
        });
    }

    // Mobile Solutions Dropdown
    const mobileSolutionsDropdown = document.getElementById('mobileSolutionsDropdown');
    const mobileSolutionsDropdownMenu = document.getElementById('mobileSolutionsDropdownMenu');

    if (mobileSolutionsDropdown && mobileSolutionsDropdownMenu) {
        mobileSolutionsDropdown.addEventListener('click', function() {
            mobileSolutionsDropdownMenu.classList.toggle('hidden');
            const icon = mobileSolutionsDropdown.querySelector('i');
            if (icon) {
                icon.style.transform = mobileSolutionsDropdownMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    }

    // Desktop Solutions Dropdown
    const solutionsDropdown = document.getElementById('solutionsDropdown');
    const solutionsDropdownMenu = document.getElementById('solutionsDropdownMenu');
    
    console.log('Dropdown elements found:', { solutionsDropdown, solutionsDropdownMenu });
    
    if (solutionsDropdown && solutionsDropdownMenu) {
        // Show dropdown on hover
        solutionsDropdown.addEventListener('mouseenter', function(e) {
            console.log('Mouse entered solutions dropdown');
            solutionsDropdown.classList.add('active');
            solutionsDropdownMenu.classList.add('show');
            console.log('Dropdown classes after show:', {
                dropdown: solutionsDropdown.classList.toString(),
                menu: solutionsDropdownMenu.classList.toString()
            });
        });
        
        // Hide dropdown when mouse leaves the dropdown area
        solutionsDropdown.addEventListener('mouseleave', function(e) {
            console.log('Mouse left solutions dropdown');
            // Check if mouse is moving to the dropdown menu
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && solutionsDropdownMenu.contains(relatedTarget)) {
                console.log('Mouse moving to dropdown menu, keeping open');
                return; // Don't hide if moving to dropdown menu
            }
            solutionsDropdown.classList.remove('active');
            solutionsDropdownMenu.classList.remove('show');
            console.log('Dropdown hidden');
        });
        
        // Hide dropdown when mouse leaves the dropdown menu
        solutionsDropdownMenu.addEventListener('mouseleave', function(e) {
            console.log('Mouse left dropdown menu');
            solutionsDropdown.classList.remove('active');
            solutionsDropdownMenu.classList.remove('show');
        });
        
        // Keep dropdown open when hovering over the menu
        solutionsDropdownMenu.addEventListener('mouseenter', function(e) {
            console.log('Mouse entered dropdown menu');
            solutionsDropdown.classList.add('active');
            solutionsDropdownMenu.classList.add('show');
        });
    } else {
        console.error('Dropdown elements not found:', { solutionsDropdown, solutionsDropdownMenu });
    }
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-fade-in-up, .animate-fade-in, .animate-slide-in-left, .animate-slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Form handling functionality
function initializeFormHandling() {
    // Website form submission
    const websiteForm = document.getElementById('websiteForm');
    if (websiteForm) {
        websiteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const websiteUrl = document.getElementById('websiteUrl').value;
            
            // Show the modal with the website URL
            showModal(websiteUrl);
        });
    }

    // "No website" link
    const noWebsiteLink = document.getElementById('noWebsiteLink');
    if (noWebsiteLink) {
        noWebsiteLink.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Desktop consultation button
    const desktopConsultationBtn = document.getElementById('desktopConsultationBtn');
    if (desktopConsultationBtn) {
        desktopConsultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Mobile consultation button
    const mobileConsultationBtn = document.getElementById('mobileConsultationBtn');
    if (mobileConsultationBtn) {
        mobileConsultationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Proposal form submission
    const proposalForm = document.getElementById('proposalForm');
    if (proposalForm) {
        proposalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProposalSubmission();
        });
    }
}

// Modal functionality
function showModal(websiteUrl = null) {
    const modal = document.getElementById('noWebsiteModal');
    const websiteField = document.getElementById('websiteField');
    const submittedWebsite = document.getElementById('submittedWebsite');
    
    if (modal) {
        // If website URL is provided, show it in the form
        if (websiteUrl && websiteField && submittedWebsite) {
            websiteField.style.display = 'block';
            submittedWebsite.value = websiteUrl;
        } else if (websiteField) {
            websiteField.style.display = 'none';
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Ensure select elements are working properly
        const servicesSelect = document.getElementById('services');
        const budgetSelect = document.getElementById('budget');
        
        if (servicesSelect) {
            console.log('Services select found:', servicesSelect);
            console.log('Services select required:', servicesSelect.required);
            console.log('Services select disabled:', servicesSelect.disabled);
            console.log('Services select style:', servicesSelect.style.cssText);
            
            // Remove any existing event listeners to prevent duplicates
            servicesSelect.removeEventListener('change', servicesSelect._changeHandler);
            servicesSelect._changeHandler = function() {
                console.log('Services selected:', this.value);
            };
            servicesSelect.addEventListener('change', servicesSelect._changeHandler);
            
            // Test if the select is clickable
            servicesSelect.addEventListener('click', function(e) {
                console.log('Services select clicked');
                e.stopPropagation(); // Prevent event bubbling
            });
            
            // Test if the select is working by trying to open it
            servicesSelect.addEventListener('mousedown', function(e) {
                console.log('Services select mousedown');
                e.stopPropagation();
            });
            
            // Add focus event listener
            servicesSelect.addEventListener('focus', function(e) {
                console.log('Services select focused');
            });
            
            // Add keydown event listener
            servicesSelect.addEventListener('keydown', function(e) {
                console.log('Services select keydown:', e.key);
            });
            
            // Fallback: if select doesn't work, create a custom dropdown
            setTimeout(() => {
                if (!servicesSelect.value && servicesSelect.style.display !== 'none') {
                    console.log('Services select might not be working, checking functionality...');
                    // Try to programmatically open the select
                    try {
                        servicesSelect.focus();
                        servicesSelect.click();
                    } catch (error) {
                        console.log('Services select interaction failed:', error);
                    }
                }
            }, 1000);
        }
        
        if (budgetSelect) {
            console.log('Budget select found:', budgetSelect);
            // Remove any existing event listeners to prevent duplicates
            budgetSelect.removeEventListener('change', budgetSelect._changeHandler);
            budgetSelect._changeHandler = function() {
                console.log('Budget selected:', this.value);
            };
            budgetSelect.addEventListener('change', budgetSelect._changeHandler);
            
            // Test if the select is clickable
            budgetSelect.addEventListener('click', function(e) {
                console.log('Budget select clicked');
                e.stopPropagation(); // Prevent event bubbling
            });
            
            // Test if the select is working by trying to open it
            budgetSelect.addEventListener('mousedown', function(e) {
                console.log('Budget select mousedown');
                e.stopPropagation();
            });
            
            // Fallback: if select doesn't work, create a custom dropdown
            setTimeout(() => {
                if (!budgetSelect.value && budgetSelect.style.display !== 'none') {
                    console.log('Budget select might not be working, checking functionality...');
                    // Try to programmatically open the select
                    try {
                        budgetSelect.focus();
                        budgetSelect.click();
                    } catch (error) {
                        console.log('Budget select interaction failed:', error);
                    }
                }
            }, 1000);
        }
    }
}

function closeModal() {
    const modal = document.getElementById('noWebsiteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const proposalForm = document.getElementById('proposalForm');
        if (proposalForm) {
            proposalForm.reset();
        }
    }
}

// Handle proposal form submission
function handleProposalSubmission() {
    const form = document.getElementById('proposalForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Validate required fields
    const servicesSelect = document.getElementById('services');
    if (!servicesSelect.value) {
        alert('Please select a service of interest.');
        servicesSelect.focus();
        return;
    }
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Show success message
        alert('Thank you! Your proposal request has been submitted. We\'ll get back to you within 24 hours.');
        
        // Reset form and close modal
        form.reset();
        closeModal();
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }, 2000);
}

// Counter animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.result-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-value'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        // Handle decimal values properly
                        if (target % 1 !== 0) {
                            counter.textContent = current.toFixed(1);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        // Show final value
                        if (target % 1 !== 0) {
                            counter.textContent = target.toFixed(1);
                        } else {
                            counter.textContent = target;
                        }
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Scroll effects
function initializeScrollEffects() {
    // Navbar scroll effect
    const navbar = document.querySelector('.nav');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize success stories carousel (after dynamic content is loaded)
    initializeSuccessCarousel();
}

function initializeSuccessCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    let currentSlide = 0;
    const totalSlides = 4;

    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.querySelector('.carousel-btn[data-direction="-1"]');
    const nextBtn = document.querySelector('.carousel-btn[data-direction="1"]');

    function updateCarousel() {
        const slideWidth = 100 / totalSlides; // 25%
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));
    }

    function moveCarousel(direction) {
        currentSlide += direction;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        if (currentSlide >= totalSlides) currentSlide = 0;
        updateCarousel();
    }

    // Bind events
    if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));
    dots.forEach(dot => {
        const index = parseInt(dot.getAttribute('data-index'), 10);
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Auto-advance
    setInterval(() => moveCarousel(1), 5000);

    // Initial state
    updateCarousel();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('noWebsiteModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}); 

// Accordion functionality (shared)
function toggleAccordion(header) {
    const accordionItem = header.parentElement;
    const content = accordionItem.querySelector('.accordion-content');
    const isActive = header.classList.contains('active');

    // Close all accordion items on the page
    document.querySelectorAll('.accordion-header').forEach(h => {
        h.classList.remove('active');
        const c = h.nextElementSibling;
        if (c && c.classList.contains('accordion-content')) {
            c.classList.remove('active');
        }
    });

    // Toggle current item
    if (!isActive) {
        header.classList.add('active');
        if (content) content.classList.add('active');
    }
} 