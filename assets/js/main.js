// Intersection Observer for animation trigger
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.id === 'score-bar') {
                startScoreAnimations();
            } else if (entry.target.id === 'results') {
                startResultsAnimations();
            } else if (entry.target.id === 'process') {
                startProcessAnimations();
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the score bar, results section, and process section
document.addEventListener('DOMContentLoaded', function() {
    observer.observe(document.getElementById('score-bar'));
    observer.observe(document.getElementById('results'));
    observer.observe(document.getElementById('process'));

    // Mobile menu toggle
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
    
    // Initialize testimonials carousel
    initTestimonialsCarousel();
});

function startScoreAnimations() {
    // Animate score bar
    const scoreBar = document.getElementById('score-bar');
    const scorePercentage = document.getElementById('score-percentage');
    setTimeout(() => {
        scoreBar.style.width = '85%';
        animateValue(scorePercentage, 0, 85, 1500, '%');
    }, 500);

    // Animate counters with different delays for visual interest
    animateValue(document.getElementById('keywords-count'), 0, 1240, 2000);
    setTimeout(() => {
        animateValue(document.getElementById('traffic-count'), 0, 3.2, 1500, '', 1);
    }, 300);
    setTimeout(() => {
        animateValue(document.getElementById('conversion-count'), 0, 62, 1500);
    }, 600);
}

function startResultsAnimations() {
    // Animate in the cards
    document.querySelectorAll('.result-card').forEach(card => {
        card.classList.remove('opacity-0', 'translate-y-8');
    });

    // Animate the numbers
    document.querySelectorAll('.result-number').forEach(number => {
        const value = parseFloat(number.dataset.value);
        const decimals = value % 1 === 0 ? 0 : 1;
        animateValue(number, 0, value, 2000, '', decimals);
    });
}

function startProcessAnimations() {
    // Animate the timeline line
    const timelineLine = document.querySelector('.timeline-line');
    timelineLine.classList.add('animate');

    // Animate each process step with a delay
    const processSteps = document.querySelectorAll('.process-step');
    const processIcons = document.querySelectorAll('.process-icon');

    processSteps.forEach((step, index) => {
        setTimeout(() => {
            step.classList.add('animate');
            processIcons[index].classList.add('animate');
        }, index * 400); // 400ms delay between each step
    });
}

function animateValue(element, start, end, duration, suffix = '', decimals = 0) {
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (range * easeOutQuart);
        
        element.textContent = current.toFixed(decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Testimonials carousel functionality
function initTestimonialsCarousel() {
    const container = document.getElementById('testimonials-container');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (!container || !prevButton || !nextButton) return;
    
    const cards = container.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    // Function to get number of visible cards based on screen size
    function getVisibleCards() {
        if (window.innerWidth >= 1024) return 3; // lg breakpoint
        if (window.innerWidth >= 768) return 2;  // md breakpoint
        return 1; // mobile
    }
    
    // Calculate card width based on viewport
    function getCardWidth() {
        const containerWidth = container.parentElement.offsetWidth;
        const visibleCards = getVisibleCards();
        const margin = 16; // 1rem margin
        return (containerWidth - (margin * (visibleCards + 1))) / visibleCards;
    }
    
    // Update carousel position
    function updateCarousel() {
        const cardWidth = getCardWidth();
        const margin = 16;
        const offset = currentIndex * (cardWidth + margin);
        container.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('bg-emerald-500');
                dot.classList.remove('bg-gray-600');
            } else {
                dot.classList.remove('bg-emerald-500');
                dot.classList.add('bg-gray-600');
            }
        });
        
        // Update button states
        const maxIndex = cards.length - getVisibleCards();
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
        
        if (prevButton.disabled) {
            prevButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        if (nextButton.disabled) {
            nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Update card widths
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.minWidth = `${cardWidth}px`;
        });
    }
    
    // Event listeners for buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const maxIndex = cards.length - getVisibleCards();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const maxIndex = cards.length - getVisibleCards();
            currentIndex = Math.min(index, maxIndex);
            updateCarousel();
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const maxIndex = cards.length - getVisibleCards();
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateCarousel();
        }, 100);
    });
    
    // Initial setup
    updateCarousel();
} 