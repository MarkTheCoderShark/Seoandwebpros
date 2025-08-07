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