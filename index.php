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

<?php includeComponent('header'); ?>

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