  // Mobile menu functionality
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const closeMenu = document.getElementById('closeMenu');
        
        function openMobileMenu() {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        hamburger.addEventListener('click', openMobileMenu);
        closeMenu.addEventListener('click', closeMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);
        
        // Close menu when clicking on a link
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Active page highlighting (simulate)
        function setActivePage() {
            const currentPage = window.location.pathname;
            const navItems = document.querySelectorAll('.nav-item, .mobile-item');
            
            navItems.forEach(item => {
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === currentPage) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Header scroll effect
        let lastScrollTop = 0;
        const header = document.querySelector('.main-header');
        
        window.addEventListener('scroll', () => {
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
            
            lastScrollTop = scrollTop;
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