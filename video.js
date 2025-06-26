 
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


// Scroll progress indicator
        window.addEventListener('scroll', function() {
            const scrollProgress = document.getElementById('scrollProgress');
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // Video overlay functionality
        function playVideo(url) {
            const overlay = document.getElementById('videoOverlay');
            const frame = document.getElementById('videoFrame');
            frame.src = url + '?autoplay=1';
            overlay.classList.add('active');
        }

        function closeVideo() {
            const overlay = document.getElementById('videoOverlay');
            const frame = document.getElementById('videoFrame');
            frame.src = '';
            overlay.classList.remove('active');
        }

        // Close video on overlay click
        document.getElementById('videoOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeVideo();
            }
        });

        // Close video on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeVideo();
            }
        });

        // Smooth scrolling for anchor links
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

        // Add loading animation to external links
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            link.addEventListener('click', function() {
                const icon = this.querySelector('i:last-child');
                if (icon) {
                    const originalClass = icon.className;
                    icon.className = 'fas fa-spinner fa-spin';
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                }
            });
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all video sections
        document.querySelectorAll('.video-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Animate stats on page load
        function animateStats() {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                if (!isNaN(target)) {
                    let current = 0;
                    const increment = target / 30;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 50);
                }
            });
        }

        // Start stats animation when page loads
        window.addEventListener('load', animateStats);

        // Add hover effects to platform badges
        document.querySelectorAll('.platform-badge').forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });
            
            badge.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });

        // Enhanced play button animations
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.2)';
                this.style.background = 'rgba(255, 255, 255, 1)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.background = 'rgba(255, 255, 255, 0.9)';
            });
        });

        // Video card hover effects
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const thumbnail = this.querySelector('.video-thumbnail');
                if (thumbnail) {
                    thumbnail.style.transform = 'scale(1.05)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const thumbnail = this.querySelector('.video-thumbnail');
                if (thumbnail) {
                    thumbnail.style.transform = 'scale(1)';
                }
            });
        });

        // Platform-specific styling transitions
        document.querySelectorAll('.video-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                if (this.classList.contains('youtube')) {
                    this.style.background = 'linear-gradient(135deg, #ff4444 0%, #aa0000 100%)';
                } else if (this.classList.contains('instagram')) {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                } else if (this.classList.contains('tiktok')) {
                    this.style.background = 'linear-gradient(135deg, #ff0050 0%, #000000 100%)';
                }
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.background = '';
                this.style.transform = '';
            });
        });