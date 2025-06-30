   
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
        

 const MEMBERSHIP_CONFIG = {
            quarterly: {
                title: 'Quarterly Membership',
                price: 'Ksh 2,800',
                paymentUrl: 'https://www.urbanswaras.co.ke/products/f55e57fb75/2971724000003048728'
            },
            annual: {
                title: 'Annual Membership',
                price: 'Ksh 8,200',
                paymentUrl: 'https://www.urbanswaras.co.ke/products/g65a202d9d/2971724000003048737'
            },
            guest: {
                title: 'Guest Runner',
                price: 'Ksh 600',
                paymentUrl: 'https://www.urbanswaras.co.ke/products/g6f30bf80d/2971724000000824032'
            }
        };

        let currentMembershipType = '';
        let countdownInterval; // Variable to store the countdown interval

        // Add 'animate-in' class to membership cards when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.membership-card');
            cards.forEach((card, index) => {
                // Add a slight delay for a staggered animation effect
                card.style.transitionDelay = `${index * 0.1}s`;
                card.classList.add('animate-in');
            });
        });


        /**
         * Displays the registration form modal, configuring it based on the selected membership type.
         * @param {string} membershipType - The type of membership selected ('quarterly', 'annual', 'guest').
         */
        function showRegistrationForm(membershipType) {
            currentMembershipType = membershipType;
            const config = MEMBERSHIP_CONFIG[membershipType];

            // Update modal content with selected membership details
            document.getElementById('modalTitle').textContent = `Join Urban Swaras - ${config.title}`;
            document.getElementById('membershipType').textContent = config.title;
            document.getElementById('membershipPrice').textContent = config.price;
            document.getElementById('membershipTypeInput').value = membershipType;

            // Configure form fields (e.g., emergency contacts, event selection) based on membership type
            configureFormForMembershipType(membershipType);

            // Reset form state and hide success/alert messages
            document.getElementById('registrationForm').reset();
            document.getElementById('registrationForm').style.display = 'block'; // Ensure form is visible
            document.getElementById('successMessage').classList.remove('show'); // Hide success message
            document.getElementById('alertMessage').classList.remove('show'); // Hide alert message
            clearFormErrors(); // Clear any previous validation errors
            resetSubmitButton(); // Reset submit button state

            // Show modal with enhanced animation by adding 'active' class
            document.getElementById('registrationModal').classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        /**
         * Adjusts the visibility and 'required' attributes of form sections
         * based on the selected membership type.
         * @param {string} membershipType - The type of membership ('quarterly', 'annual', 'guest').
         */
        function configureFormForMembershipType(membershipType) {
            const secondEmergencyContact = document.getElementById('secondEmergencyContact');
            const bloodGroupSection = document.getElementById('bloodGroupSection');
            const eventSelection = document.getElementById('eventSelection');

            // Get required input fields for toggling 'required' attribute
            const emergency2NameInput = document.getElementById('emergency2Name');
            const emergency2RelationshipInput = document.getElementById('emergency2Relationship');
            const emergency2PhoneInput = document.getElementById('emergency2Phone');
            const bloodGroupSelect = document.getElementById('bloodGroup');

            if (membershipType === 'guest') {
                // Guest Runner: Hide second emergency contact and blood group, show event selection
                secondEmergencyContact.style.display = 'none';
                bloodGroupSection.style.display = 'none';
                eventSelection.style.display = 'block';

                // Remove 'required' attribute for hidden fields to bypass validation
                emergency2NameInput.removeAttribute('required');
                emergency2RelationshipInput.removeAttribute('required');
                emergency2PhoneInput.removeAttribute('required');
                bloodGroupSelect.removeAttribute('required');
            } else {
                // Full Members (Quarterly/Annual): Show all fields, hide event selection
                secondEmergencyContact.style.display = 'block';
                bloodGroupSection.style.display = 'block';
                eventSelection.style.display = 'none';

                // Add 'required' attribute for visible fields
                emergency2NameInput.setAttribute('required', 'required');
                emergency2RelationshipInput.setAttribute('required', 'required');
                emergency2PhoneInput.setAttribute('required', 'required');
                bloodGroupSelect.setAttribute('required', 'required');
            }
        }

        /**
         * Closes the registration modal, resets its state, and enables background scrolling.
         */
        function closeModal() {
            // Remove 'active' class to trigger fade-out and slide-down animation
            document.getElementById('registrationModal').classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable background scrolling

            // Clear any existing countdown interval if modal is closed prematurely
            clearInterval(countdownInterval);

            // Reset form and messages after the transition completes (300ms)
            setTimeout(() => {
                document.getElementById('registrationForm').reset();
                document.getElementById('registrationForm').style.display = 'block';
                document.getElementById('successMessage').classList.remove('show');
                document.getElementById('alertMessage').classList.remove('show');
                clearFormErrors();
                resetSubmitButton();
            }, 300);
        }

        // Close modal when clicking outside of the modal content
        document.getElementById('registrationModal').addEventListener('click', function(e) {
            // If the clicked element is the modal-overlay itself (not its children), close the modal
            if (e.target === this) {
                closeModal();
            }
        });

        // Toggle 'Other Event' text input based on checkbox state
        document.getElementById('otherEvent').addEventListener('change', function() {
            const otherEventGroup = document.getElementById('otherEventGroup');
            if (this.checked) {
                otherEventGroup.style.display = 'block';
                document.getElementById('otherEventText').setAttribute('required', 'required');
            } else {
                otherEventGroup.style.display = 'none';
                document.getElementById('otherEventText').removeAttribute('required');
                document.getElementById('otherEventText').value = ''; // Clear input if unchecked
            }
        });

        // Toggle 'Other Discovery' text input based on checkbox state
        document.getElementById('otherDiscovery').addEventListener('change', function() {
            const otherDiscoveryGroup = document.getElementById('otherDiscoveryGroup');
            if (this.checked) {
                otherDiscoveryGroup.style.display = 'block';
                document.getElementById('otherDiscoveryText').setAttribute('required', 'required');
            } else {
                otherDiscoveryGroup.style.display = 'none';
                document.getElementById('otherDiscoveryText').removeAttribute('required');
                document.getElementById('otherDiscoveryText').value = ''; // Clear input if unchecked
            }
        });


        /**
         * Validates all required fields in the form based on the current membership type.
         * Displays error messages and an overall alert if validation fails.
         * @returns {boolean} True if the form is valid, false otherwise.
         */
        function validateForm() {
            const alertMessage = document.getElementById('alertMessage');
            let isValid = true;
            let missingFields = [];

            // Clear previous errors and hide alert message
            clearFormErrors();
            alertMessage.classList.remove('show');

            // Basic required fields (common to all memberships)
            const basicFields = [
                { id: 'fullName', name: 'Full Name' },
                { id: 'email', name: 'Email Address' },
                { id: 'phone', name: 'Phone Number' },
                { id: 'emergencyName', name: 'Emergency Contact Name' },
                { id: 'emergencyRelationship', name: 'Emergency Contact Relationship' },
                { id: 'emergencyPhone', name: 'Emergency Contact Phone' }
            ];

            // Add additional required fields for full members (non-guest)
            if (currentMembershipType !== 'guest') {
                basicFields.push(
                    { id: 'emergency2Name', name: 'Second Emergency Contact Name' },
                    { id: 'emergency2Relationship', name: 'Second Emergency Contact Relationship' },
                    { id: 'emergency2Phone', name: 'Second Emergency Contact Phone' },
                    { id: 'bloodGroup', name: 'Blood Group' }
                );
            }

            // Validate all determined required fields
            basicFields.forEach(field => {
                const element = document.getElementById(field.id);
                // Check if element exists and is visible (to avoid validating hidden fields that are not required)
                // And check if its value is empty or just whitespace
                if (element && element.offsetParent !== null && !element.value.trim()) {
                    element.classList.add('error');
                    // Find the associated error message element and display it
                    const errorMessageElement = element.nextElementSibling;
                    if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                        errorMessageElement.style.opacity = 1;
                        errorMessageElement.style.transform = 'translateY(0)';
                    }
                    missingFields.push(field.name);
                    isValid = false;
                }
            });

            // Specific validation for email format
            const emailInput = document.getElementById('email');
            if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
                emailInput.classList.add('error');
                const errorMessageElement = emailInput.nextElementSibling;
                if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                    errorMessageElement.textContent = 'Please enter a valid email address (e.g., user@example.com)';
                    errorMessageElement.style.opacity = 1;
                    errorMessageElement.style.transform = 'translateY(0)';
                }
                isValid = false;
            }

            // Validate event selection for guest runners
            if (currentMembershipType === 'guest') {
                const eventCheckboxes = document.querySelectorAll('input[name="eventParticipation"]:checked');
                const otherEventCheckbox = document.getElementById('otherEvent');
                const otherEventTextInput = document.getElementById('otherEventText');

                if (eventCheckboxes.length === 0) {
                    missingFields.push('Event Selection');
                    isValid = false;
                } else if (otherEventCheckbox.checked && !otherEventTextInput.value.trim()) {
                    // If 'Other Event' is checked, its text field must be filled
                    otherEventTextInput.classList.add('error');
                    const errorMessageElement = otherEventTextInput.nextElementSibling;
                    if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                        errorMessageElement.textContent = 'Please specify the "Other Event"';
                        errorMessageElement.style.opacity = 1;
                        errorMessageElement.style.transform = 'translateY(0)';
                    }
                    isValid = false;
                }
            }

            // Validate discovery method checkbox
            const discoveryCheckboxes = document.querySelectorAll('input[name="discoveryMethod"]:checked');
            const otherDiscoveryCheckbox = document.getElementById('otherDiscovery');
            const otherDiscoveryTextInput = document.getElementById('otherDiscoveryText');

            if (discoveryCheckboxes.length === 0) {
                missingFields.push('How you discovered Urban Swaras');
                isValid = false;
            } else if (otherDiscoveryCheckbox.checked && !otherDiscoveryTextInput.value.trim()) {
                // If 'Other' discovery is checked, its text field must be filled
                otherDiscoveryTextInput.classList.add('error');
                const errorMessageElement = otherDiscoveryTextInput.nextElementSibling;
                if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                    errorMessageElement.textContent = 'Please specify how you discovered us';
                    errorMessageElement.style.opacity = 1;
                    errorMessageElement.style.transform = 'translateY(0)';
                }
                isValid = false;
            }

            // Validate terms and conditions
            const agreeTerms = document.getElementById('agreeTerms');
            if (!agreeTerms.checked) {
                // No specific input to add 'error' class to, but we can highlight the label or the section
                const termsCheckboxLabel = document.querySelector('.terms-checkbox');
                if (termsCheckboxLabel) {
                    termsCheckboxLabel.style.borderColor = 'var(--accent)';
                    termsCheckboxLabel.style.boxShadow = '0 0 0 2px rgba(245, 124, 81, 0.2)';
                }
                missingFields.push('Terms and Conditions Agreement');
                isValid = false;
            } else {
                 // Reset border if terms are checked
                const termsCheckboxLabel = document.querySelector('.terms-checkbox');
                if (termsCheckboxLabel) {
                    termsCheckboxLabel.style.borderColor = ''; // Reset to default
                    termsCheckboxLabel.style.boxShadow = ''; // Reset shadow
                }
            }


            // Show alert if validation fails
            if (!isValid) {
                alertMessage.textContent = `Please fill in all required fields: ${[...new Set(missingFields)].join(', ')}.`;
                alertMessage.classList.add('show');
                // Scroll to the alert message for better UX
                alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return isValid;
        }

        /**
         * Helper function to validate email format using a regular expression.
         * @param {string} email - The email string to validate.
         * @returns {boolean} True if the email is valid, false otherwise.
         */
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        /**
         * Clears all 'error' classes and hides error messages from form inputs.
         */
        function clearFormErrors() {
            const errorInputs = document.querySelectorAll('.form-input.error');
            errorInputs.forEach(input => {
                input.classList.remove('error');
                const errorMessageElement = input.nextElementSibling;
                if (errorMessageElement && errorMessageElement.classList.contains('error-message')) {
                    errorMessageElement.style.opacity = 0;
                    errorMessageElement.style.transform = 'translateY(-5px)';
                    // Reset default error message text
                    if (input.id === 'email') errorMessageElement.textContent = 'Please enter a valid email address';
                    else if (input.id === 'fullName') errorMessageElement.textContent = 'Please enter your full name';
                    else if (input.id === 'phone') errorMessageElement.textContent = 'Please enter your phone number';
                    else if (input.id === 'emergencyName') errorMessageElement.textContent = 'Please enter emergency contact name';
                    else if (input.id === 'emergencyRelationship') errorMessageElement.textContent = 'Please enter relationship';
                    else if (input.id === 'emergencyPhone') errorMessageElement.textContent = 'Please enter emergency contact phone';
                    else if (input.id === 'emergency2Name') errorMessageElement.textContent = 'Please enter second emergency contact name';
                    else if (input.id === 'emergency2Relationship') errorMessageElement.textContent = 'Please enter second emergency contact relationship';
                    else if (input.id === 'emergency2Phone') errorMessageElement.textContent = 'Please enter second emergency contact phone';
                    else if (input.id === 'bloodGroup') errorMessageElement.textContent = 'Please select your blood group';
                }
            });
            // Reset terms and conditions label border
            const termsCheckboxLabel = document.querySelector('.terms-checkbox');
            if (termsCheckboxLabel) {
                termsCheckboxLabel.style.borderColor = ''; // Reset to default
                termsCheckboxLabel.style.boxShadow = ''; // Reset shadow
            }
        }

        /**
         * Resets the submit button to its default state (enabled, no spinner, original text).
         */
        function resetSubmitButton() {
            const submitBtn = document.getElementById('submitBtn');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const submitIcon = document.getElementById('submitIcon');
            const submitText = document.getElementById('submitText');

            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            submitIcon.style.display = 'inline';
            submitText.textContent = 'Complete Registration';
        }

        /**
         * Handles the form submission event.
         * Performs validation, shows loading state, simulates submission, and displays success message.
         */
        document.getElementById('registrationForm').addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            // Validate form before proceeding
            if (!validateForm()) {
                return; // Stop if validation fails
            }

            // Show loading state on the submit button
            const submitBtn = document.getElementById('submitBtn');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const submitIcon = document.getElementById('submitIcon');
            const submitText = document.getElementById('submitText');

            submitBtn.disabled = true;
            loadingSpinner.style.display = 'inline-block';
            submitIcon.style.display = 'none';
            submitText.textContent = 'Processing...';

            // Simulate form submission (e.g., AJAX request)
            setTimeout(() => {
                // In a real application, you would send the form data to a server here.
                // Example: fetch('/api/register', { method: 'POST', body: new FormData(this) })
                // .then(response => response.json())
                // .then(data => { /* handle success */ })
                // .catch(error => { /* handle error */ });

                // Hide the registration form and display the success message
                document.getElementById('registrationForm').style.display = 'none';
                document.getElementById('successMessage').classList.add('show');

                // Start countdown for redirection
                let countdown = 5;
                const countdownElement = document.getElementById('countdown');
                countdownElement.textContent = countdown;

                countdownInterval = setInterval(() => {
                    countdown--;
                    countdownElement.textContent = countdown;
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        // Redirect to the payment URL based on the selected membership type
                        const paymentUrl = MEMBERSHIP_CONFIG[currentMembershipType].paymentUrl;
                        if (paymentUrl) {
                            window.location.href = paymentUrl;
                        } else {
                            // Fallback if paymentUrl is not defined for some reason
                            console.error('Payment URL not found for', currentMembershipType);
                            closeModal(); // Just close modal if no redirect
                        }
                    }
                }, 1000);

            }, 2000); // Simulate 2 seconds processing time
        });