// Activity Page JavaScript
document.addEventListener('DOMContentLoaded', function () {

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize gallery modal
    initGalleryModal();

    // Initialize PDF gallery
    initPDFGallery();
});

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    const modal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.gallery-modal-image');
    const modalYoutube = document.querySelector('.gallery-modal-youtube');
    const closeBtn = document.querySelector('.gallery-modal-close');
    const prevBtn = document.querySelector('.gallery-modal-prev');
    const nextBtn = document.querySelector('.gallery-modal-next');

    let currentIndex = 0; // Initialize currentIndex

    function openGalleryModal(index) {
        // Ensure that we always work with the current state of gallery items
        const currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.pdf-item)'));
        if (index < 0 || index >= currentGalleryItems.length) {
            console.error("Invalid index for gallery modal:", index);
            return;
        }

        const item = currentGalleryItems[index];
        currentIndex = index; // Update the current index

        // Reset modal content
        modalImage.style.display = 'none';
        modalYoutube.style.display = 'none';
        modalYoutube.innerHTML = '';

        if (item.classList.contains('youtube')) {
            const youtubeUrl = item.getAttribute('data-youtube');
            const videoId = extractYouTubeId(youtubeUrl);

            if (videoId) {
                // Corrected YouTube embed URL (changed googleusercontent.com to youtube.com)
                modalYoutube.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                `;
                modalYoutube.style.display = 'block';
            }
        } else {
            const img = item.querySelector('img');
            if (img) {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                modalImage.style.display = 'block';
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Check total items again for navigation button display
        const totalItems = currentGalleryItems.length;
        prevBtn.style.display = totalItems > 1 ? 'block' : 'none';
        nextBtn.style.display = totalItems > 1 ? 'block' : 'none';
    }

    function closeGalleryModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalYoutube.innerHTML = '';
    }

    function navigateGallery(direction) {
        const currentGalleryItems = Array.from(document.querySelectorAll('.gallery-item:not(.pdf-item)'));
        if (currentGalleryItems.length === 0) return;

        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % currentGalleryItems.length;
        } else {
            currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
        }
        openGalleryModal(currentIndex);
    }

    function extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|\/watch\?v=|\/embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    galleryItems.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            openGalleryModal(index);
        });
    });

    // Modal controls
    closeBtn.addEventListener('click', closeGalleryModal);
    prevBtn.addEventListener('click', () => navigateGallery('prev'));
    nextBtn.addEventListener('click', () => navigateGallery('next'));

    // Close when clicking on the modal background
    modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target === modal.querySelector('.gallery-modal-content')) { // Added content div as target
            closeGalleryModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') closeGalleryModal();
        if (e.key === 'ArrowLeft') navigateGallery('prev');
        if (e.key === 'ArrowRight') navigateGallery('next');
    });
}

// PDF Gallery Modal
function initPDFGallery() {
    const pdfGalleryItems = document.querySelectorAll('.gallery-grid .gallery-item.pdf-item');

    if (pdfGalleryItems.length === 0) return;

    // Create PDF modal if it doesn't exist
    if (!document.querySelector('.pdf-modal')) {
        const pdfModalHTML = `
            <div class="pdf-modal">
                <div class="pdf-modal-header">
                    <h3 class="pdf-modal-title"></h3>
                    <div class="pdf-modal-actions">
                        <button class="pdf-modal-download">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Baixar PDF
                        </button>
                        <button class="pdf-modal-close">&times;</button>
                    </div>
                </div>
                <div class="pdf-modal-content">
                    <iframe class="pdf-iframe"></iframe>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', pdfModalHTML);
    }

    const pdfModal = document.querySelector('.pdf-modal');
    const pdfIframe = document.querySelector('.pdf-iframe');
    const pdfTitle = document.querySelector('.pdf-modal-title');
    const pdfCloseBtn = document.querySelector('.pdf-modal-close');
    const pdfDownloadBtn = document.querySelector('.pdf-modal-download');
    let currentPdfUrl = '';

    function openPDFModal(pdfPath, title) {
        currentPdfUrl = pdfPath;
        pdfIframe.src = pdfPath;
        pdfTitle.textContent = title;
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Configure download button
        pdfDownloadBtn.onclick = function () {
            const link = document.createElement('a');
            link.href = currentPdfUrl;
            link.download = title + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    function closePDFModal() {
        pdfModal.classList.remove('active');
        document.body.style.overflow = '';
        pdfIframe.src = ''; // Clear iframe
        currentPdfUrl = '';
    }

    // Add click events to PDF items
    pdfGalleryItems.forEach((item) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const pdfPath = this.getAttribute('data-pdf');
            const title = this.querySelector('img').alt;
            openPDFModal(pdfPath, title);
        });
    });

    // Event listeners
    pdfCloseBtn.addEventListener('click', closePDFModal);

    // Close on background click
    pdfModal.addEventListener('click', function (e) {
        if (e.target === pdfModal || e.target === pdfModal.querySelector('.pdf-modal-content')) {
            closePDFModal();
        }
    });

    // Close with ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
            closePDFModal();
        }
    });
}