# Solution Page Template Guide

This template system provides a consistent, professional design for all solution pages across the website. Each template uses placeholder variables that can be easily replaced with page-specific content.

## Template Structure

The template (`solution-page-template.html`) includes:

1. **SEO-optimized head section** with meta tags, schema markup
2. **Hero section** with title, description, and CTA buttons
3. **Why This Service Matters** section with impact cards and statistics
4. **Services/Features** section with service cards
5. **Process** section with step-by-step methodology
6. **FAQ** section with expandable questions
7. **Testimonials** section with client reviews
8. **CTA** section with call-to-action
9. **Contact** section with form
10. **Related Services** section with links to other pages

## Placeholder Variables

### Page Meta Information
- `{{PAGE_TITLE}}` - Page title (e.g., "Professional Website Design")
- `{{META_DESCRIPTION}}` - Meta description for SEO
- `{{META_KEYWORDS}}` - Keywords for SEO
- `{{PAGE_URL}}` - URL slug (e.g., "website-design")
- `{{OG_IMAGE}}` - Open Graph image filename
- `{{SCHEMA_SERVICES}}` - JSON-LD schema services array

### Hero Section
- `{{HERO_TITLE}}` - Main headline
- `{{HERO_DESCRIPTION}}` - Hero description text
- `{{CTA_PRIMARY}}` - Primary button text
- `{{CTA_SECONDARY}}` - Secondary button text

### Why Section
- `{{WHY_TITLE}}` - Section title
- `{{WHY_DESCRIPTION}}` - Section description
- `{{IMPACT_CARDS}}` - HTML for impact cards
- `{{STATS_CARDS}}` - HTML for statistics cards

### Services Section
- `{{SERVICES_TITLE}}` - Section title
- `{{SERVICES_DESCRIPTION}}` - Section description
- `{{SERVICE_CARDS}}` - HTML for service cards

### Process Section
- `{{PROCESS_TITLE}}` - Section title
- `{{PROCESS_DESCRIPTION}}` - Section description
- `{{PROCESS_STEPS}}` - HTML for process steps

### FAQ Section
- `{{SERVICE_NAME}}` - Service name for FAQ context
- `{{FAQ_ITEMS}}` - HTML for FAQ items

### Testimonials Section
- `{{TESTIMONIAL_CARDS}}` - HTML for testimonial cards

### CTA Section
- `{{CTA_TITLE}}` - CTA headline
- `{{CTA_DESCRIPTION}}` - CTA description
- `{{CTA_BUTTON_TEXT}}` - CTA button text

### Related Services
- `{{RELATED_SERVICES}}` - HTML for related service cards

## Component Templates

### Impact Card Template
```html
<div class="impact-card fade-up" style="animation-delay: 0.1s">
    <div class="impact-card-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Card Title</h3>
    <p>Card description text explaining the impact or benefit.</p>
</div>
```

### Stat Card Template
```html
<div class="stat-card fade-up" style="animation-delay: 0.1s">
    <div class="stat-number">200%</div>
    <div class="stat-label">Stat Label</div>
    <div class="stat-description">Brief description</div>
</div>
```

### Service Card Template
```html
<div class="service-card fade-up" style="animation-delay: 0.1s">
    <div class="service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Service Title</h3>
    <p>Service description explaining what's included.</p>
    <ul class="service-features">
        <li><i class="fas fa-check"></i> Feature 1</li>
        <li><i class="fas fa-check"></i> Feature 2</li>
        <li><i class="fas fa-check"></i> Feature 3</li>
    </ul>
</div>
```

### Process Step Template
```html
<div class="process-step fade-up" style="animation-delay: 0.1s">
    <div class="process-number">1</div>
    <h3>Step Title</h3>
    <p>Step description explaining what happens in this phase.</p>
</div>
```

### FAQ Item Template
```html
<div class="faq-item fade-up" style="animation-delay: 0.1s">
    <div class="faq-question" onclick="toggleFAQ(this)">
        <span>Question text here?</span>
        <i class="fas fa-chevron-down faq-icon"></i>
    </div>
    <div class="faq-answer">
        <p>Answer text explaining the response to the question.</p>
    </div>
</div>
```

### Testimonial Card Template
```html
<div class="testimonial-card fade-up" style="animation-delay: 0.1s">
    <div class="testimonial-quote">
        "Client testimonial quote goes here. Make it specific and impactful."
    </div>
    <div class="testimonial-author">
        <div class="testimonial-avatar">J</div>
        <div class="testimonial-info">
            <h4>John Doe</h4>
            <p>CEO, Company Name</p>
        </div>
    </div>
</div>
```

### Related Service Card Template
```html
<a href="/solutions/service-url/" class="related-service-card fade-up" style="animation-delay: 0.1s">
    <div class="related-service-icon">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3 class="related-service-title">Service Title</h3>
    <p class="related-service-description">Brief service description.</p>
</a>
```

## How to Create a New Solution Page

1. **Copy the template** to your desired location
2. **Replace all placeholder variables** with page-specific content
3. **Generate component HTML** using the component templates above
4. **Update file paths** if necessary (../../ for subdirectories)
5. **Test the page** to ensure all components work properly

## Animation Delays

Use staggered animation delays for visual appeal:
- First item: `style="animation-delay: 0.1s"`
- Second item: `style="animation-delay: 0.2s"`
- Third item: `style="animation-delay: 0.3s"`
- Continue incrementing by 0.1s for each item

## Best Practices

1. **Keep content scannable** - Use bullet points and short paragraphs
2. **Include specific numbers** - Use real statistics and metrics
3. **Write compelling headlines** - Make them benefit-focused
4. **Use consistent icons** - Stick to Font Awesome icons
5. **Test on mobile** - Ensure responsive design works properly
6. **Optimize for SEO** - Include relevant keywords naturally
7. **Add schema markup** - Include structured data for better search results

## File Structure

```
solutions/
├── website-design/
│   └── index.html
├── website-development/
│   └── index.html
├── seo/
│   └── index.html
├── app-development/
│   └── index.html
└── software-development/
    └── index.html
```

Each solution category can have subcategory pages in the same directory. 