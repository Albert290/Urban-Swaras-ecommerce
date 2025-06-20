 
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

      
   // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Counter animation function
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    element.textContent = Math.floor(current) + (target >= 10 ? '+' : '');
                }
            }, 16);
        }

        // Initialize observers
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.media-card, .stat-number');
            animatedElements.forEach(el => observer.observe(el));

            // Add hover effects for enhanced interactivity
            const cards = document.querySelectorAll('.media-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });
        });

        // Smooth scroll for better UX
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
        
        let selectedStoryType = '';

        function selectStoryType(type) {
            selectedStoryType = type;
            // Visual feedback for selection
            document.querySelectorAll('.story-type-card').forEach(card => {
                card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
            event.currentTarget.style.borderColor = '#F57C51';
            event.currentTarget.style.boxShadow = '0 0 20px rgba(245, 124, 81, 0.3)';
        }

        function openStoryModal() {
            const modal = document.getElementById('storyModal');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Pre-select story type if one was clicked
            if (selectedStoryType) {
                const typeSelect = document.querySelector('select[name="type"]');
                typeSelect.value = selectedStoryType;
            }
        }

        function closeStoryModal() {
            const modal = document.getElementById('storyModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function submitStory(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(event.target);
            
            // Show loading state
            const submitBtn = event.target.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting... ✨';
            submitBtn.disabled = true;
            submitBtn.style.background = '#6BA2D9';
            
            // Submit to Formspree
            fetch('https://formspree.io/f/urbanswaras@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Success
                    submitBtn.textContent = 'Story Submitted! 🎉';
                    submitBtn.style.background = '#4CAF50';
                    
                    setTimeout(() => {
                        closeStoryModal();
                        showSuccessMessage();
                        
                        // Reset form and button
                        event.target.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = 'var(--accent)';
                        
                        // Clear selected story type styling
                        document.querySelectorAll('.story-type-card').forEach(card => {
                            card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            card.style.boxShadow = '';
                        });
                        selectedStoryType = '';
                    }, 2000);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                // Error handling
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.style.background = '#f44336';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'var(--accent)';
                }, 3000);
            });
        }

        function showSuccessMessage() {
            const message = document.createElement('div');
            message.innerHTML = `
                <div style="position: fixed; top: 2rem; right: 2rem; background: #4CAF50; color: white; padding: 1rem 2rem; border-radius: 10px; z-index: 1001; animation: slideInRight 0.5s ease-out;">
                    <h4 style="margin: 0 0 0.5rem 0;">Story Submitted! 🎉</h4>
                    <p style="margin: 0; font-size: 0.9rem;">Thank you for sharing your running journey with us. We'll review it and get back to you soon!</p>
                </div>
            `;
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 5000);
        }

        function copyHashtag(element) {
            const hashtag = element.textContent;
            navigator.clipboard.writeText(hashtag).then(() => {
                const originalText = element.textContent;
                element.textContent = 'Copied! ✓';
                element.style.background = '#4CAF50';
                
                setTimeout(() => {
                    element.textContent = originalText;
                    element.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 1500);
            });
        }

        // Close modal when clicking outside
        document.getElementById('storyModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeStoryModal();
            }
        });
 

        // Observe animated elements when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.cta-title, .cta-subtitle, .story-types, .cta-actions, .community-hashtags');
            animatedElements.forEach(el => observer.observe(el));
        });

        // Add some extra interactivity
        document.addEventListener('DOMContentLoaded', () => {
            // Parallax effect for floating runners
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const runners = document.querySelectorAll('.floating-runners');
                runners.forEach((runner, index) => {
                    const speed = 0.5 + (index * 0.1);
                    runner.style.transform = `translateY(${scrolled * speed}px)`;
                });
            });
        });