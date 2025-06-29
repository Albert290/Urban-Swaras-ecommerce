  
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

document.addEventListener('DOMContentLoaded', function() { 
     // Accordion functionality
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = header.nextElementSibling;
                
                // Close other items
                document.querySelectorAll('.accordion-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }
            });
        });

        // Open first accordion by default
        document.querySelector('.accordion-item').classList.add('active');
        document.querySelector('.accordion-content').style.maxHeight = 
            document.querySelector('.accordion-content').scrollHeight + 'px';
});

// Toggle document viewer
        function toggleDocument(type) {
            const viewer = document.getElementById('privacy-viewer');
            const isVisible = viewer.style.display === 'block';
            
            if (isVisible) {
                closeDocument();
            } else {
                viewer.style.display = 'block';
                viewer.scrollIntoView({ behavior: 'smooth' });
                // Add animation
                setTimeout(() => {
                    viewer.classList.add('animate-in');
                }, 100);
            }
        }

        function closeDocument() {
            const viewer = document.getElementById('privacy-viewer');
            viewer.classList.remove('animate-in');
            setTimeout(() => {
                viewer.style.display = 'none';
            }, 300);
        }

        // Toggle dropdown menus
        function toggleDropdown(type) {
            const dropdown = document.getElementById(type + '-dropdown');
            const allDropdowns = document.querySelectorAll('.dropdown-menu');
            
            // Close all other dropdowns
            allDropdowns.forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
        }

        // Download functionality with notification
        function downloadDocument(type) {
            showDownloadNotification();
            
            // Simulate download (in real implementation, this would trigger actual file download)
            console.log('Downloading:', type);
            
            // Close any open dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }

        function showDownloadNotification() {
            const notification = document.getElementById('downloadNotification');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.download-card')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        // Scroll animations
        function animateOnScroll() {
            const cards = document.querySelectorAll('.download-card');
            
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                const cardVisible = 150;
                
                if (cardTop < window.innerHeight - cardVisible) {
                    card.classList.add('animate-in');
                }
            });
        }

        // Initialize animations
        window.addEventListener('load', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll);

        // Add hover effects to cards
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.download-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });

        // Add this script to data.html
window.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    
    // If the 'view' parameter is 'privacy', automatically trigger the button click
    if (viewParam === 'privacy') {
        // Small delay to ensure the page is fully loaded
        setTimeout(function() {
            toggleDocument('privacy');
        }, 100);
    }
});

// Add this script to regulation.html
window.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const downloadParam = urlParams.get('download');
    
    // If the 'download' parameter is 'rules', automatically trigger the download
    if (downloadParam === 'rules') {
        // Small delay to ensure the page is fully loaded
        setTimeout(function() {
            downloadDocument('rules');
        }, 100);
    }
});

  document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU FUNCTIONALITY =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const closeMenu = document.getElementById('closeMenu');

    // Check if elements exist before adding event listeners
    if (!hamburger || !mobileMenu || !mobileOverlay) {
        console.warn('Mobile menu elements not found');
    } else {
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
    }

    // ===== ACTIVE PAGE HIGHLIGHTING =====
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
    setActivePage();

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });

    // ===== HEADER SCROLL EFFECT =====
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
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // ===== WINDOW RESIZE HANDLER =====
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // ===== DOCUMENT VIEWER & DOWNLOAD FUNCTIONALITY =====
    // File path configuration
    const filePaths = {
        privacy: '/documents/data-privacy-notice.pdf',
        constitution: '/documents/club-constitution.pdf',
        rules: '/documents/club-rules.pdf',
        signup: '/documents/member-signup-form.pdf',
        'financials-2024': '/documents/financials-2024.pdf',
        'financials-2023': '/documents/financials-2023.pdf',
        'financials-2022': '/documents/financials-2022.pdf',
        'agm-2024': '/documents/agm-minutes-2024.pdf',
        'agm-2023': '/documents/agm-minutes-2023.pdf',
        'agm-2022': '/documents/agm-minutes-2022.pdf'
    };

    // Modal functions
    function showMembershipConfirm(documentType) {
        const modal = document.getElementById('membershipModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMembershipModal() {
        const modal = document.getElementById('membershipModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Document viewer functions
    function toggleDocument(docType) {
        const viewer = document.getElementById('privacy-viewer');
        if (docType === 'privacy' && viewer) {
            viewer.style.display = 'block';
            document.body.style.overflow = 'hidden';
            viewer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function closeDocument() {
        const viewer = document.getElementById('privacy-viewer');
        if (viewer) {
            viewer.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Download functionality
    function downloadDocument(docType) {
        const filePath = filePaths[docType];
        if (!filePath) {
            console.error('File path not configured for:', docType);
            return;
        }
        
        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = filePath;
        a.download = filePath.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show download notification
        const notification = document.getElementById('downloadNotification');
        if (notification) {
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // Close modal when clicking outside
    const membershipModal = document.getElementById('membershipModal');
    if (membershipModal) {
        membershipModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeMembershipModal();
            }
        });
    }

    // ===== BUTTON HOVER EFFECTS =====
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-close, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('btn-primary') && this.style.background === 'rgb(31, 60, 95)') {
                this.style.background = '#2a4d73';
            } else if (this.classList.contains('btn-secondary') || this.classList.contains('action-btn')) {
                this.style.background = '#5590c7';
            } else if (this.classList.contains('btn-close')) {
                this.style.background = '#5590c7';
            } else if (this.style.background === 'rgb(245, 124, 81)') {
                this.style.background = '#e6663a';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('btn-primary') && this.style.background === 'rgb(42, 77, 115)') {
                this.style.background = '#1F3C5F';
            } else if (this.classList.contains('btn-secondary') || this.classList.contains('action-btn')) {
                this.style.background = '#6BA2D9';
            } else if (this.classList.contains('btn-close')) {
                this.style.background = '#6BA2D9';
            } else if (this.style.background === 'rgb(230, 102, 58)') {
                this.style.background = '#F57C51';
            }
        });
    });

    // Email link hover effect
    const emailLink = document.querySelector('a[href*="mailto"]');
    if (emailLink) {
        emailLink.addEventListener('mouseenter', function() {
            this.style.color = '#1F3C5F';
        });
        emailLink.addEventListener('mouseleave', function() {
            this.style.color = '#6BA2D9';
        });
    }

    // ===== AUTO-OPEN BASED ON URL PARAMETERS =====
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    const downloadParam = urlParams.get('download');
    
    if (viewParam === 'privacy') {
        setTimeout(() => toggleDocument('privacy'), 100);
    }
    if (downloadParam === 'rules') {
        setTimeout(() => downloadDocument('rules'), 100);
    }
});