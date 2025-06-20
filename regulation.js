  
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


 // Scroll animation observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with scroll-animation class
        document.querySelectorAll('.scroll-animation').forEach(el => {
            observer.observe(el);
        });

        // Add stagger effect to committee members
        document.addEventListener('DOMContentLoaded', function() {
            const committeeMembers = document.querySelectorAll('.committee-member');
            committeeMembers.forEach((member, index) => {
                member.style.animationDelay = `${index * 0.1}s`;
            });

            const creMembers = document.querySelectorAll('.cre-member');
            creMembers.forEach((member, index) => {
                member.style.animationDelay = `${index * 0.05}s`;
            });
        });

        // Smooth scroll for document links (when real links are added)
        document.querySelectorAll('.document-link').forEach(link => {
            link.addEventListener('click', function(e) {
                // Add actual link functionality here when documents are ready
                console.log('Document link clicked:', this.previousElementSibling.textContent);
            });
        });

        // Add subtle parallax effect to floating icons
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.floating-icon');
            
            parallax.forEach((icon, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                icon.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.01}deg)`;
            });
        });

// Urban Swaras Organogram Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Add interactive tooltips and enhanced hover effects
    const orgCards = document.querySelectorAll('.org-card');
    
    // Enhanced card interactions
    orgCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
            showPositionDetails(this);
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
            addGlowEffect(this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
            removeGlowEffect(this);
        });
    });
    
    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateConnectionLines();
            }
        });
    }, observerOptions);
    
    // Observe the organogram container
    const organogramContainer = document.querySelector('.organogram-container');
    if (organogramContainer) {
        observer.observe(organogramContainer);
    }
    
    // Initialize responsive behavior
    handleResponsiveLayout();
    window.addEventListener('resize', debounce(handleResponsiveLayout, 250));
});

// Create ripple effect on card click
function createRippleEffect(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x - 2}px;
        top: ${y - 2}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    // Add ripple animation keyframes if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(40);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show position details (could be expanded to show modal or tooltip)
function showPositionDetails(card) {
    const position = card.dataset.position;
    const positionTitle = card.querySelector('.position-title').textContent;
    const positionName = card.querySelector('.position-name').textContent;
    
    // Create a subtle notification
    showNotification(`${positionTitle}: ${positionName}`, position);
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.position-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'position-notification';
    notification.textContent = message;
    
    const colors = {
        patron: 'var(--primary)',
        chairperson: 'var(--secondary)',
        secretary: 'var(--accent)',
        'trail-king': 'var(--accent)',
        cre: 'var(--accent)',
        treasurer: 'var(--accent)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || 'var(--primary)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add glow effect on hover
function addGlowEffect(element) {
    const isLeadership = element.classList.contains('patron-card') || 
                        element.classList.contains('chairperson-card');
    
    const glowColor = isLeadership ? 'rgba(245, 124, 81, 0.4)' : 'rgba(107, 162, 217, 0.4)';
    
    element.style.boxShadow = `
        0 15px 40px rgba(0, 0, 0, 0.15),
        0 0 20px ${glowColor}
    `;
}

 

 