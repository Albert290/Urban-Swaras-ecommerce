 
 
// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const closeMenu = document.getElementById('closeMenu');

    // Check if elements exist before adding event listeners
    if (!hamburger || !mobileMenu || !mobileOverlay) {
        console.warn('Mobile menu elements not found');
        return;
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Reset animations
        const mobileItems = document.querySelectorAll('.mobile-links li');
        mobileItems.forEach((item, index) => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `slideIn 0.3s forwards`;
                item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            }, 10);
        });
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Event listeners
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        openMobileMenu();
    });

    if (closeMenu) {
        closeMenu.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }

    mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close menu when clicking on a link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', function() {
            // Only close menu if it's not an external link
            if (!this.hasAttribute('target')) {
                closeMobileMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Active page highlighting
    function setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item, .mobile-item');

        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });
    }

    // Set active page on load
    setActivePage();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                closeMobileMenu(); // Close menu after smooth scroll
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('scrolled-down');
            } else {
                header.classList.remove('scrolled-down');
            }

            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});


 
        // Performance optimization
        class PerformanceOptimizer {
            constructor() {
                this.optimizeImages();
                this.setupLazyLoading();
            }

            optimizeImages() {
                // Add loading="lazy" to any images that might be added later
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (!img.hasAttribute('loading')) {
                        img.setAttribute('loading', 'lazy');
                    }
                });
            }

            setupLazyLoading() {
                // Lazy load modal content
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    modal.style.willChange = 'transform, opacity';
                });
            }
        }

        // Initialize all classes when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize all functionality
            const modalManager = new ModalManager();
            const scrollAnimations = new ScrollAnimations();
            const buttonEnhancements = new ButtonEnhancements();
            const linkManager = new LinkManager();
            const performanceOptimizer = new PerformanceOptimizer();

            // Add smooth scrolling for any anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add loading state management
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');
            });

            console.log('Urban Swaras Stories Section initialized successfully!');
        });

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .animate-in {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            .loaded {
                opacity: 1;
            }
            
            /* Additional hover effects */
            .story-column {
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .story-column:nth-child(1) {
                animation-delay: 0.1s;
            }
            
            .story-column:nth-child(2) {
                animation-delay: 0.3s;
            }
            
            .story-column:nth-child(3) {
                animation-delay: 0.5s;
            }
        `;
        document.head.appendChild(style);     
 
        // File upload handling
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileList = document.getElementById('fileList');
        let selectedFiles = [];

        // Drag and drop functionality
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        });

        // File input change
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });

        // Handle file selection/addition
        function handleFiles(files) {
            files.forEach(file => {
                if (selectedFiles.find(f => f.name === file.name)) {
                    alert(`File "${file.name}" already added.`);
                    return;
                }
                selectedFiles.push(file);
                displayFile(file);
            });
            updateUploadButtonState();
        }

        // Display selected file
        function displayFile(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span><span class="math-inline">\{file\.name\}</span\>
</div\>
<button class\="remove\-file" data\-name\="</span>{file.name}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
           
            // Remove file from list
            fileItem.querySelector('.remove-file').addEventListener('click', function() {
                const fileName = this.dataset.name;
                selectedFiles = selectedFiles.filter(file => file.name !== fileName);
                fileItem.remove();
                updateUploadButtonState();
            });
        }

        // Update upload button state
        function updateUploadButtonState() {
            const uploadBtn = document.getElementById('uploadBtn');
            uploadBtn.disabled = selectedFiles.length === 0;
        }
        updateUploadButtonState(); // Initial state

        // Form submission handling
        const storyUploadForm = document.getElementById('storyUploadForm');
        const successMessage = document.getElementById('successMessage');

        storyUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // For demonstration, just show the success message
            successMessage.classList.add('show');
            storyUploadForm.reset();
            fileList.innerHTML = '';
            selectedFiles = [];
            updateUploadButtonState();

            // Simulate server-side processing delay
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 3000);
        });