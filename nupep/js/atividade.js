document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
        });
    });
    
    // Testimonials Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const testimonialNav = document.getElementById('testimonialNav');
    let currentTestimonial = 0;
    
    // Create dots for testimonials
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToTestimonial(index);
        });
        testimonialNav.appendChild(dot);
    });
    
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    // Function to go to a specific testimonial
    function goToTestimonial(n) {
        testimonials[currentTestimonial].classList.remove('active');
        testimonialDots[currentTestimonial].classList.remove('active');
        
        currentTestimonial = n;
        
        testimonials[currentTestimonial].classList.add('active');
        testimonialDots[currentTestimonial].classList.add('active');
    }
    
    // Auto advance testimonials
    setInterval(() => {
        let next = (currentTestimonial + 1) % testimonials.length;
        goToTestimonial(next);
    }, 7000);
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Animate elements on scroll
    function handleScroll() {
        const sections = document.querySelectorAll('.activity-overview, .benefit-card, .gallery-grid, .testimonials-slider, .faq-container, .related-card');
        
        sections.forEach(section => {
            const position = section.getBoundingClientRect();
            
            // If the element is in the viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                section.style.animation = 'fadeIn 1s ease forwards';
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for elements in viewport
    handleScroll();
});