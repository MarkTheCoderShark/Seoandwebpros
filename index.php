<?php
// Function to include HTML components
function includeComponent($component) {
    $file = "components/{$component}.html";
    if (file_exists($file)) {
        include $file;
    } else {
        echo "<!-- Error: Component {$component} not found -->";
    }
}

// Set page-specific variables
$pageTitle = "Home";
$pageDescription = "Expert SEO, web development, and digital marketing services to help your business grow online. Get a free consultation today!";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - SEO & Web Pros' : 'SEO & Web Pros - Digital Solutions for Business Growth'; ?></title>
    <meta name="description" content="<?php echo isset($pageDescription) ? $pageDescription : 'Expert SEO, web development, and digital marketing services to help your business grow online. Get a free consultation today!'; ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/favicon.png">
    
    <!-- Fonts - Optimized loading -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
    
    <!-- Font Awesome - Load asynchronously -->
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"></noscript>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Custom CSS - Load asynchronously -->
    <link rel="preload" href="assets/css/optimized-ui.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="assets/css/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preload" href="assets/css/animations.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="assets/css/optimized-ui.css">
        <link rel="stylesheet" href="assets/css/style.css">
        <link rel="stylesheet" href="assets/css/animations.css">
    </noscript>
</head>
<body class="bg-gray-900 text-white font-inter">
    <!-- Navigation -->
    <?php includeComponent('navigation'); ?>

    <!-- Hero Section -->
    <?php includeComponent('hero'); ?>

    <!-- Clients Section -->
    <?php includeComponent('clients'); ?>

    <!-- Results Section -->
    <?php includeComponent('results'); ?>

    <!-- Services Section -->
    <?php includeComponent('services'); ?>

    <!-- Testimonials Section -->
    <?php includeComponent('testimonials'); ?>

    <!-- Team Section -->
    <?php includeComponent('team'); ?>

    <!-- Contact Section -->
    <?php includeComponent('contact'); ?>

    <?php includeComponent('footer-scripts'); ?>
</body>
</html> 