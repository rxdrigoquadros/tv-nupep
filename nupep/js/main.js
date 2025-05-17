// Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const sliderNav = document.getElementById('sliderNav');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;
    
    // Create navigation dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetInterval();
        });
        sliderNav.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.slider-dot');
    
    // Initialize the first slide
    slides[0].classList.add('active');
    
    // Function to go to a specific slide
    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Event listeners for previous and next buttons
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetInterval();
    });
    
    // Auto-advance slides
    function startInterval() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }
    
    // Start the slideshow
    startInterval();
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Animation on Scroll
    function handleScroll() {
        const elements = document.querySelectorAll('.activity-card, .about-content, .tribute-content, .contact-container');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If the element is in the viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                element.style.animation = 'fadeInUp 1s ease forwards';
            }
        });
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for elements in viewport
    handleScroll();
});