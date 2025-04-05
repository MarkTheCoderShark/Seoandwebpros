// Digital Ecosystem Orbital Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the network visualization
    initNetworkVisualization();
});

function initNetworkVisualization() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'network-canvas';
    canvas.className = 'network-canvas';
    
    // Add canvas to the hero section
    const heroSection = document.querySelector('.hero-section');
    const networkContainer = document.createElement('div');
    networkContainer.className = 'network-container';
    networkContainer.appendChild(canvas);
    
    // Insert the network container before the hero content
    const heroContent = heroSection.querySelector('.max-w-7xl');
    heroSection.insertBefore(networkContainer, heroContent);
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window change
    window.addEventListener('resize', resizeCanvas);
    
    // Define nodes (services)
    const nodes = [
        { id: 'core', x: canvas.width / 2, y: canvas.height / 2, radius: 30, color: '#3b82f6', label: 'SEO & WEB PROS' },
        // Inner ring - SEO services
        { id: 'seo', x: 0, y: 0, radius: 15, color: '#10b981', label: 'SEO' },
        { id: 'keywords', x: 0, y: 0, radius: 15, color: '#10b981', label: 'Keywords' },
        { id: 'content', x: 0, y: 0, radius: 15, color: '#10b981', label: 'Content' },
        // Middle ring - Web Development
        { id: 'web', x: 0, y: 0, radius: 15, color: '#3b82f6', label: 'Web Dev' },
        { id: 'responsive', x: 0, y: 0, radius: 15, color: '#3b82f6', label: 'Responsive' },
        { id: 'ecommerce', x: 0, y: 0, radius: 15, color: '#3b82f6', label: 'E-commerce' },
        // Outer ring - Marketing
        { id: 'marketing', x: 0, y: 0, radius: 15, color: '#8b5cf6', label: 'Marketing' },
        { id: 'social', x: 0, y: 0, radius: 15, color: '#8b5cf6', label: 'Social' },
        { id: 'ads', x: 0, y: 0, radius: 15, color: '#8b5cf6', label: 'Ads' }
    ];
    
    // Define connections between nodes
    const connections = [
        // Core connections
        { from: 'core', to: 'seo', strength: 0.8 },
        { from: 'core', to: 'web', strength: 0.8 },
        { from: 'core', to: 'marketing', strength: 0.8 },
        
        // Inner ring connections
        { from: 'seo', to: 'keywords', strength: 0.6 },
        { from: 'seo', to: 'content', strength: 0.6 },
        { from: 'keywords', to: 'content', strength: 0.4 },
        
        // Middle ring connections
        { from: 'web', to: 'responsive', strength: 0.6 },
        { from: 'web', to: 'ecommerce', strength: 0.6 },
        { from: 'responsive', to: 'ecommerce', strength: 0.4 },
        
        // Outer ring connections
        { from: 'marketing', to: 'social', strength: 0.6 },
        { from: 'marketing', to: 'ads', strength: 0.6 },
        { from: 'social', to: 'ads', strength: 0.4 },
        
        // Cross-ring connections
        { from: 'content', to: 'web', strength: 0.3 },
        { from: 'responsive', to: 'marketing', strength: 0.3 },
        { from: 'ecommerce', to: 'ads', strength: 0.3 }
    ];
    
    // Particle system
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? '#3b82f6' : '#10b981',
            speed: Math.random() * 0.5 + 0.2,
            angle: Math.random() * Math.PI * 2,
            connection: connections[Math.floor(Math.random() * connections.length)]
        });
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 150;
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouseX = 0;
        mouseY = 0;
    });
    
    // Animation variables
    let time = 0;
    const orbitRadius = {
        inner: 120,
        middle: 200,
        outer: 280
    };
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update time
        time += 0.005;
        
        // Update node positions
        updateNodePositions();
        
        // Draw connections
        drawConnections();
        
        // Draw nodes
        drawNodes();
        
        // Update and draw particles
        updateParticles();
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Update node positions based on orbits
    function updateNodePositions() {
        // Core node stays in center
        nodes[0].x = canvas.width / 2;
        nodes[0].y = canvas.height / 2;
        
        // Inner ring - SEO services
        nodes[1].x = canvas.width / 2 + Math.cos(time) * orbitRadius.inner;
        nodes[1].y = canvas.height / 2 + Math.sin(time) * orbitRadius.inner;
        
        nodes[2].x = canvas.width / 2 + Math.cos(time + Math.PI * 2/3) * orbitRadius.inner;
        nodes[2].y = canvas.height / 2 + Math.sin(time + Math.PI * 2/3) * orbitRadius.inner;
        
        nodes[3].x = canvas.width / 2 + Math.cos(time + Math.PI * 4/3) * orbitRadius.inner;
        nodes[3].y = canvas.height / 2 + Math.sin(time + Math.PI * 4/3) * orbitRadius.inner;
        
        // Middle ring - Web Development
        nodes[4].x = canvas.width / 2 + Math.cos(time * 0.7) * orbitRadius.middle;
        nodes[4].y = canvas.height / 2 + Math.sin(time * 0.7) * orbitRadius.middle;
        
        nodes[5].x = canvas.width / 2 + Math.cos(time * 0.7 + Math.PI * 2/3) * orbitRadius.middle;
        nodes[5].y = canvas.height / 2 + Math.sin(time * 0.7 + Math.PI * 2/3) * orbitRadius.middle;
        
        nodes[6].x = canvas.width / 2 + Math.cos(time * 0.7 + Math.PI * 4/3) * orbitRadius.middle;
        nodes[6].y = canvas.height / 2 + Math.sin(time * 0.7 + Math.PI * 4/3) * orbitRadius.middle;
        
        // Outer ring - Marketing
        nodes[7].x = canvas.width / 2 + Math.cos(time * 0.5) * orbitRadius.outer;
        nodes[7].y = canvas.height / 2 + Math.sin(time * 0.5) * orbitRadius.outer;
        
        nodes[8].x = canvas.width / 2 + Math.cos(time * 0.5 + Math.PI * 2/3) * orbitRadius.outer;
        nodes[8].y = canvas.height / 2 + Math.sin(time * 0.5 + Math.PI * 2/3) * orbitRadius.outer;
        
        nodes[9].x = canvas.width / 2 + Math.cos(time * 0.5 + Math.PI * 4/3) * orbitRadius.outer;
        nodes[9].y = canvas.height / 2 + Math.sin(time * 0.5 + Math.PI * 4/3) * orbitRadius.outer;
        
        // Apply mouse interaction
        nodes.forEach(node => {
            if (node.id !== 'core') {
                const dx = node.x - mouseX;
                const dy = node.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouseRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseRadius - distance) / mouseRadius;
                    node.x += Math.cos(angle) * force * 2;
                    node.y += Math.sin(angle) * force * 2;
                }
            }
        });
    }
    
    // Draw connections between nodes
    function drawConnections() {
        connections.forEach(conn => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            
            if (fromNode && toNode) {
                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate gradient
                const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
                gradient.addColorStop(0, fromNode.color);
                gradient.addColorStop(1, toNode.color);
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1 * conn.strength;
                ctx.globalAlpha = 0.3 + 0.2 * Math.sin(time * 2 + distance * 0.01);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    }
    
    // Draw nodes
    function drawNodes() {
        nodes.forEach(node => {
            // Draw glow
            const glow = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2
            );
            glow.addColorStop(0, node.color);
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            
            // Draw label for core node
            if (node.id === 'core') {
                ctx.font = '14px Poppins';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + node.radius + 20);
            }
        });
    }
    
    // Update and draw particles
    function updateParticles() {
        particles.forEach(particle => {
            // Find connection nodes
            const fromNode = nodes.find(n => n.id === particle.connection.from);
            const toNode = nodes.find(n => n.id === particle.connection.to);
            
            if (fromNode && toNode) {
                // Calculate position along the connection
                const progress = (Math.sin(time * 2 + particle.angle) + 1) / 2;
                
                particle.x = fromNode.x + (toNode.x - fromNode.x) * progress;
                particle.y = fromNode.y + (toNode.y - fromNode.y) * progress;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = 0.5 + 0.5 * Math.sin(time * 3 + particle.angle);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        });
    }
    
    // Start animation
    animate();
} 