   
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
  // Smooth scrolling and interactions
        function scrollToMembership() {
            document.querySelector('.membership-types').scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Payment modal functionality
        function showPaymentInfo(type) {
            const modal = document.getElementById('paymentModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
            
            let content = '';
            
            switch(type) {
                case 'quarterly':
                    modalTitle.textContent = 'Quarterly Membership Payment';
                    content = `
                        <div class="payment-info">
                            <h4>Payment Details</h4>
                            <p><strong>Amount:</strong> Ksh 2,800</p>
                            <p><strong>Breakdown:</strong> Ksh 1,800 (quarterly) + Ksh 1,000 (annual renewal)</p>
                            <div class="payment-steps">
                                <h5>Steps to Join:</h5>
                                <ol>
                                    <li>Make payment of Ksh 2,800 to our payment details</li>
                                    <li>Fill in the membership form</li>
                                    <li>Wait for confirmation</li>
                                </ol>
                            </div>
                            <button class="form-btn">Fill Membership Form</button>
                        </div>
                    `;
                    break;
                case 'annual':
                    modalTitle.textContent = 'Annual Membership Payment';
                    content = `
                        <div class="payment-info">
                            <h4>Payment Details</h4>
                            <p><strong>Amount:</strong> Ksh 8,200</p>
                            <p><strong>Breakdown:</strong> Ksh 7,200 (subscription) + Ksh 1,000 (renewal)</p>
                            <p><em>Pro-rated if joining mid-year</em></p>
                            <div class="payment-steps">
                                <h5>Steps to Join:</h5>
                                <ol>
                                    <li>Make payment of Ksh 8,200 to our payment details</li>
                                    <li>Fill in the membership form</li>
                                    <li>Wait for confirmation</li>
                                </ol>
                            </div>
                            <button class="form-btn">Fill Membership Form</button>
                        </div>
                    `;
                    break;
                case 'guest':
                    modalTitle.textContent = 'Guest Runner Payment';
                    content = `
                        <div class="payment-info">
                            <h4>Payment Details</h4>
                            <p><strong>Amount:</strong> Ksh 600 per event</p>
                            <p><strong>Payment:</strong> Must be made in advance</p>
                            <div class="payment-steps">
                                <h5>What's Included:</h5>
                                <ul>
                                    <li>Full support during the run</li>
                                    <li>Water and fruits</li>
                                    <li>Community experience</li>
                                </ul>
                                <h5>Payment Options:</h5>
                                <ul>
                                    <li>Pay via our payment details</li>
                                    <li>Pay through <a href="https://lu.ma/user/Urbanswaras" target="_blank">Luma</a></li>
                                </ul>
                            </div>
                        </div>
                    `;
                    break;
            }
            
            modalBody.innerHTML = content;
            modal.style.display = 'block';
            
            // Add entrance animation
            setTimeout(() => {
                modal.querySelector('.modal-content').style.opacity = '1';
                modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            }, 10);
        }

        function closeModal() {
            const modal = document.getElementById('paymentModal');
            modal.style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('paymentModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Scroll animations
        function animateOnScroll() {
            const cards = document.querySelectorAll('.membership-card, .review-card, .content-card');
            
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                const cardVisible = 150;
                
                if (cardTop < window.innerHeight - cardVisible) {
                    card.classList.add('animate-in');
                }
            });
        }

        // Hero animations
        function initHeroAnimations() {
            const runners = document.querySelectorAll('.running-icons i');
            runners.forEach((runner, index) => {
                setTimeout(() => {
                    runner.style.animation = `runAcross 8s linear infinite`;
                    runner.style.animationDelay = `${index * 2}s`;
                }, index * 1000);
            });
        }

        // Initialize on load
        window.addEventListener('load', () => {
            animateOnScroll();
            initHeroAnimations();
        });

        window.addEventListener('scroll', animateOnScroll);

        // Add interactive hover effects to cards
        document.addEventListener('DOMContentLoaded', function() {
            const membershipCards = document.querySelectorAll('.membership-card');
            
            membershipCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
        