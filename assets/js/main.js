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

// Testimonials scrolling functionality
function scrollTestimonials(direction) {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem gap between cards
    const scrollAmount = cardWidth + gap;
    
    if (direction === 'next') {
        track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    } else {
        track.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Initialize testimonials scroll buttons visibility
function initTestimonialsScroll() {
    const track = document.querySelector('.testimonials-track');
    const prevButton = document.querySelector('.scroll-button.prev');
    const nextButton = document.querySelector('.scroll-button.next');
    
    // Check scroll position and update button visibility
    function updateScrollButtons() {
        const isAtStart = track.scrollLeft === 0;
        const isAtEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth;
        
        prevButton.style.opacity = isAtStart ? '0.5' : '1';
        prevButton.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        
        nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        nextButton.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
    }
    
    // Update buttons on scroll
    track.addEventListener('scroll', updateScrollButtons);
    
    // Initial check
    updateScrollButtons();
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialsScroll();
}); 