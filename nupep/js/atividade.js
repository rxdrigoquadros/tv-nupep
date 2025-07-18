document.addEventListener('DOMContentLoaded', function () {

    // Gallery Modal/Lightbox
    initGalleryModal();

    function initGalleryModal() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentGalleryIndex = 0;

        // Criar o modal se não existir
        if (!document.querySelector('.gallery-modal')) {
            const modalHTML = `
                <div class="gallery-modal">
                    <div class="gallery-modal-content">
                        <button class="gallery-modal-close">&times;</button>
                        <button class="gallery-modal-nav gallery-modal-prev">‹</button>
                        <button class="gallery-modal-nav gallery-modal-next">›</button>
                        <div id="gallery-modal-media-container"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        const modal = document.querySelector('.gallery-modal');
        const mediaContainer = document.getElementById('gallery-modal-media-container');
        const closeBtn = document.querySelector('.gallery-modal-close');
        const prevBtn = document.querySelector('.gallery-modal-prev');
        const nextBtn = document.querySelector('.gallery-modal-next');

        // Função para extrair ID do YouTube
        function getYouTubeId(url) {
            const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        // Adicionar evento de clique em cada item da galeria
        galleryItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                currentGalleryIndex = index;
                openGalleryModal(item);
            });
        });

        function openGalleryModal(item) {
            const img = item.querySelector('img');
            const isYouTube = item.classList.contains('youtube');

            if (isYouTube) {
                const youtubeUrl = item.getAttribute('data-youtube');
                const videoId = getYouTubeId(youtubeUrl);

                if (videoId) {
                    mediaContainer.innerHTML = `
                        <iframe 
                            class="gallery-modal-iframe" 
                            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    `;
                } else {
                    // Fallback caso não consiga extrair o ID
                    mediaContainer.innerHTML = `
                        <p style="color: white; text-align: center;">Não foi possível carregar o vídeo.</p>
                    `;
                }
            } else {
                mediaContainer.innerHTML = `
                    <img class="gallery-modal-media" src="${img.src}" alt="${img.alt || ''}">
                `;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Atualizar navegação
            updateNavigation();
        }

        function closeGalleryModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';

            // Limpar o container para parar vídeos do YouTube
            mediaContainer.innerHTML = '';
        }

        function navigateGallery(direction) {
            currentGalleryIndex = (currentGalleryIndex + direction + galleryItems.length) % galleryItems.length;
            openGalleryModal(galleryItems[currentGalleryIndex]);
        }

        function updateNavigation() {
            // Mostrar/ocultar botões de navegação se necessário
            prevBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
        }

        // Event listeners
        closeBtn.addEventListener('click', closeGalleryModal);
        prevBtn.addEventListener('click', () => navigateGallery(-1));
        nextBtn.addEventListener('click', () => navigateGallery(1));

        // Fechar ao clicar fora do conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeGalleryModal();
            }
        });

        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeGalleryModal();
                    break;
                case 'ArrowLeft':
                    navigateGallery(-1);
                    break;
                case 'ArrowRight':
                    navigateGallery(1);
                    break;
            }
        });
    }

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
        anchor.addEventListener('click', function (e) {
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
    });
}

// Gallery Modal for Images and YouTube videos
function initGalleryModal() {
    if (window.galleryModalInitialized) return;
    window.galleryModalInitialized = true;

    // Select all gallery items, excluding PDF items
    const galleryItems = document.querySelectorAll('.gallery-item:not(.pdf-item)');

    if (galleryItems.length === 0) return;

    // Create the modal if it doesn't exist
    if (!document.querySelector('.gallery-modal')) {
        const modalHTML = `
            <div class="gallery-modal">
                <button class="gallery-modal-close">×</button>
                <button class="gallery-modal-prev">❮</button>
                <button class="gallery-modal-next">❯</button>
                <div class="gallery-modal-content">
                    <img class="gallery-modal-image" src="" alt="">
                    <div class="gallery-modal-youtube"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    window.addEventListener('scroll', handleScroll);

    // Initial check for elements in viewport
    handleScroll();
});
