// Component loading functionality
async function loadComponents() {
    await Promise.all([
        loadNavigation(),
        loadFooter()
    ]);
}

// Load navigation component
async function loadNavigation() {
    try {
        const response = await fetch('/components/navigation.html');
        const html = await response.text();
        document.getElementById('navigation').innerHTML = html;
        
        // Initialize navigation after loading
        if (typeof initializeNavigation === 'function') {
            initializeNavigation();
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Load footer component
async function loadFooter() {
    try {
        const response = await fetch('/components/footer.html');
        const html = await response.text();
        document.getElementById('footer').innerHTML = html;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
}); 