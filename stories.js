 
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

// Blog links data
const blogLinks = [
    {
        title: "Touring Kenya Through The Sporting Calendar",
        description: "Business Daily Africa feature on Kenya's sporting events and running culture.",
        url: "https://drive.google.com/file/d/1xigsjojfY5yLzirVp9taOWx5hhlManUh/view",
        icon: "fas fa-external-link-alt"
    },
    {
        title: "USRC Newsletter - November 2019",
        description: "Latest updates and highlights from Urban Swaras Running Club community.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/11/USRC-Newsletter-November-2019.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - August 2019",
        description: "Monthly newsletter featuring training tips and community stories.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/08/USRC_Newsletter_August_2019.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - June 2019",
        description: "Mid-year highlights and upcoming events from our running community.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/06/USRC-Newsletter-June-2019.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - March 2019",
        description: "Spring edition with race results and training achievements.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/03/USRC-Newsletter-March-2019.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - January 2019",
        description: "New year edition featuring goals and community resolutions.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/03/USRC-Newsletter-January-2019.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - December 2018",
        description: "Year-end wrap-up with achievements and holiday greetings.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2019/01/USRC-Newsletter-December-2018.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - October 2018",
        description: "Fall edition with seasonal training tips and event highlights.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2018/11/USRC-Newsletter-October-2018.pdf",
        icon: "fas fa-file-pdf"
    },
    {
        title: "USRC Newsletter - August 2018",
        description: "Summer newsletter featuring community activities and achievements.",
        url: "https://urbanswaras.co.ke/wp-content/uploads/2018/08/USRC-Newsletter-August-2018.pdf",
        icon: "fas fa-file-pdf"
    }
];

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('blogsModal');
    const readAllBtn = document.getElementById('readAllBlogsBtn');
    const closeBtn = document.querySelector('.close-btn');
    const blogItems = document.querySelectorAll('.blog-item');

    // Show modal when clicking "Read All Blogs" button
    if (readAllBtn) {
        readAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideModal();
        });
    }

    // Close modal when clicking outside of it
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Add click handlers to blog items
    blogItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
            if (blogLinks[index] && blogLinks[index].url) {
                window.open(blogLinks[index].url, '_blank');
            }
        });
    });

    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            hideModal();
        }
    });

    // Show modal function
    function showModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Add animation class
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
    }

    // Hide modal function
    function hideModal() {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'modalSlideOut 0.3s ease-in';
        
        setTimeout(function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore body scroll
        }, 300);
    }
});

      
// Media links data
     // Media links data
const mediaLinks = [
   /* {
        url: 'https://urbanswaras.co.ke/wp-content/uploads/2019/11/USRC-Newsletter-November-2019.pdf',
        title: 'USRC Newsletter - November 2019',
        description: 'Official Urban Swaras Running Club newsletter featuring member highlights and club updates.'
    },*/
    {
        url: 'https://www.businessdailyafrica.com/bd/lifestyle/touring-kenya-through-the-sporting-calendar--2044200',
        title: 'Touring Kenya Through The Sporting Calendar',
        description: 'Business Daily Africa feature on Kenya\'s sporting events and running culture.'
    },
    {
        url: 'https://www.businessdailyafrica.com/bd/lifestyle/health-fitness/victor-kamau-s-nine-year-ultra-run-addiction--4514092',
        title: 'Victor Kamau\'s Nine-Year Ultra Run Addiction',
        description: 'In-depth profile of Victor Kamau and his journey in ultra-running.'
    },
    {
        url: 'https://www.businessdailyafrica.com/bd/lifestyle/the-running-clubs-taking-over-nairobi-3865094',
        title: 'The Running Clubs Taking Over Nairobi',
        description: 'Feature article about the growing running club culture in Nairobi, including Urban Swaras.'
    },
    {
        url: 'https://www.businessdailyafrica.com/bd/lifestyle/health-fitness/urban-swaras-a-running-club-changing-lives--2243486#google_vignette',
        title: 'Urban Swaras: A Running Club Changing Lives',
        description: 'Comprehensive coverage of how Urban Swaras is transforming lives through running.'
    }
];

// Video links data
const videoLinks = [
    {
        url: 'https://youtu.be/YXBnN7L19iY?si=HbOtrctrwL-4xx09',
        title: 'Urban Swaras Training Session',
        description: 'Join us for an exciting training session with the Urban Swaras running community.'
    },
    {
        url: 'https://youtu.be/4-ke31svONg?si=ZLm3ru0fyvCN5-8F',
        title: 'Marathon Preparation Journey',
        description: 'Follow our members as they prepare for their marathon challenges.'
    },
    {
        url: 'https://youtu.be/EmHsqz9USio?si=HQSGmSC9ZkXg9EoP',
        title: 'Community Running Event',
        description: 'Highlights from our community running event and member experiences.'
    },
    {
        url: 'https://youtu.be/5UVdYSZR3wY?si=fmGtIbwgOosd0_J5',
        title: 'Runner Success Stories',
        description: 'Inspiring success stories from Urban Swaras running club members.'
    }
];

// Show media links modal
function showMediaLinks() {
    const modal = document.getElementById('mediaModal');
    const linksContainer = document.getElementById('mediaLinks');
   
    linksContainer.innerHTML = '';
   
    mediaLinks.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.className = 'media-link';
        linkElement.innerHTML = `
            <div class="link-title"><i class="fas fa-external-link-alt"></i> ${link.title}</div>
            <div class="link-description">${link.description}</div>
        `;
        linksContainer.appendChild(linkElement);
    });
   
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Show video links modal
function showVideoLinks() {
    const modal = document.getElementById('videoModal');
    const linksContainer = document.getElementById('videoLinks');
   
    linksContainer.innerHTML = '';
   
    videoLinks.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.target = '_blank';
        linkElement.className = 'media-link';
        linkElement.innerHTML = `
            <div class="link-title"><i class="fab fa-youtube"></i> ${link.title}</div>
            <div class="link-description">${link.description}</div>
        `;
        linksContainer.appendChild(linkElement);
    });
   
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal(this.id);
        }
    });
});
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