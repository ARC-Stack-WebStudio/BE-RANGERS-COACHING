// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('mainNavbar');
const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
const mobileToggler = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNav();
});

// ========== NAVBAR ACTIVE LINK HIGHLIGHTING ==========
function updateActiveNav() {
    const scrollY = window.scrollY;
    
    navbarLinks.forEach(link => {
        link.classList.remove('active');
        
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const sectionTop = targetSection.offsetTop - 150;
                const sectionBottom = sectionTop + targetSection.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    link.classList.add('active');
                }
            }
        }
    });
}

// ========== CLOSE MOBILE MENU ON LINK CLICK ==========
navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
            mobileToggler.click();
        }
    });
});

// ========== SMOOTH SCROLLING FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 100;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== BACK TO TOP BUTTON ==========
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== FLOATING ACTIONS ==========
const floatingActions = document.getElementById('floatingActions');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        floatingActions.classList.add('show');
    } else {
        floatingActions.classList.remove('show');
    }
});

// ========== COUNTER ANIMATION WITH SMOOTH FADE EFFECT ==========
const counters = document.querySelectorAll('.counter');
let countUpDone = false;

function animateCounters() {
    counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const statCard = counter.closest('.stat-card');
        
        // Add staggered fade-in animation
        statCard.style.animation = `fadeInLeft 0.8s ease-out ${index * 0.15}s both`;
        
        let current = 0;
        const duration = 2500 + (index * 200); // 2.5 seconds, staggered
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);
            current = Math.floor(target * easeOutQuad);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when section comes into view
const resultsSection = document.querySelector('.results-section');
if (resultsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countUpDone) {
                animateCounters();
                countUpDone = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(resultsSection);
}

// ========== SCROLL REVEAL ANIMATION ==========
const revealElements = document.querySelectorAll('.about-image, .feature-card, .course-card, .faculty-card, .testimonial-card, .purpose-card, .result-card');

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal', 'revealed');
            scrollRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    scrollRevealObserver.observe(element);
});

// ========== ENQUIRY FORM VALIDATION & SUBMISSION ==========
const enquiryForm = document.getElementById('enquiryForm');
const enquiryModalForm = document.getElementById('enquiryModalForm');

if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const studentName = document.getElementById('studentName').value.trim();
        const parentName = document.getElementById('parentName').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const studentClass = document.getElementById('studentClass').value;
        const message = document.getElementById('message').value.trim();
        
        // Validate phone number
        if (!isValidPhone(mobile)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        // Show success message
        showNotification('Thank you! We will contact you shortly.', 'success');
        
        // Generate WhatsApp message
        const whatsappMessage = generateWhatsAppMessage(studentName, parentName, mobile, studentClass, message);
        
        // Clear form
        enquiryForm.reset();
        
        // Open WhatsApp after a short delay (for user experience)
        setTimeout(() => {
            openWhatsApp(whatsappMessage);
        }, 500);
    });
}

if (enquiryModalForm) {
    enquiryModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const studentName = document.getElementById('modalStudentName').value.trim();
        const mobile = document.getElementById('modalMobile').value.trim();
        const studentClass = document.getElementById('modalClass').value;
        
        if (!isValidPhone(mobile)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        showNotification('Enquiry submitted! Redirecting to WhatsApp...', 'success');
        
        const whatsappMessage = `Hello BE RANGERS COACHING,\n\nI am interested in the ${studentClass} course.\n\nStudent Name: ${studentName}\nPhone: ${mobile}\n\nPlease share the course details and fees.\n\nThank you!`;
        
        enquiryModalForm.reset();
        
        setTimeout(() => {
            openWhatsApp(whatsappMessage);
            // Close modal
            const modal = document.querySelector('.modal.show');
            if (modal) {
                const bootstrapModal = new window.bootstrap.Modal(modal);
                bootstrapModal.hide();
            }
        }, 500);
    });
}

// ========== FORM VALIDATION HELPERS ==========
function isValidPhone(phone) {
    return phone.match(/^\d{10}$/) || phone.match(/^\+91\d{10}$/);
}

function isValidEmail(email) {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function generateWhatsAppMessage(studentName, parentName, mobile, studentClass, message) {
    return `Hello BE RANGERS COACHING,\n\nI would like to inquire about the ${studentClass} course.\n\n` +
        `Student Name: ${studentName}\n` +
        `Parent Name: ${parentName}\n` +
        `Phone: ${mobile}\n` +
        `${message ? `Message: ${message}\n` : ''}` +
        `Please share the course details, batch timings, and fees.\n\nThank you!`;
}

function openWhatsApp(message) {
    const phoneNumber = '919373072406';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.4s ease-out;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ========== COURSE MODAL FUNCTIONALITY ==========
const courseModal = document.getElementById('courseModal');
const courseModalBody = document.getElementById('courseModalBody');

const courseDetails = {
    'Class 8': {
        title: 'Class 8 - Foundation Building',
        duration: 'Full Academic Year',
        subjects: 'Mathematics, Science, English, Social Studies',
        description: 'Build strong fundamentals with concept-based teaching and regular assessments.',
        features: ['Daily Classes', 'Concept-Based Teaching', 'Weekly Tests', 'Doubt Solving', 'Study Materials Included']
    },
    'Class 9': {
        title: 'Class 9 - Intermediate Level',
        duration: 'Full Academic Year',
        subjects: 'Mathematics, Science, English, Social Studies',
        description: 'Intermediate preparation with emphasis on problem-solving and advanced concepts.',
        features: ['Daily Classes', 'Problem Solving Sessions', 'Bi-weekly Tests', 'Personal Guidance', 'Complete Study Material']
    },
    'Class 10': {
        title: 'Class 10 - Board Exam Preparation',
        duration: 'Full Academic Year + Revision',
        subjects: 'Mathematics, Science, English, Social Studies',
        description: 'Intensive preparation for SSC and CBSE board exams with board-focused strategies.',
        features: ['Daily Classes', 'Weekly Mock Tests', 'Exam Pattern Training', 'Last Minute Revision', 'Board Exam Strategy Sessions']
    },
    'JEE': {
        title: 'JEE Main & Advanced Preparation',
        duration: '2 Years (Class 11-12)',
        subjects: 'Physics, Chemistry, Mathematics',
        description: 'Comprehensive preparation for engineering entrance exams with expert faculty.',
        features: ['Expert Mentors', 'Regular Mock Tests', 'Problem Solving Sessions', 'Advanced Level Concepts', 'Revision Classes']
    },
    'NEET': {
        title: 'NEET Medical Entrance Preparation',
        duration: '2 Years (Class 11-12)',
        subjects: 'Physics, Chemistry, Biology',
        description: 'Strategic medical entrance exam preparation with focus on Biology.',
        features: ['Medical Faculty', 'Detailed Concept Clarity', 'Regular Assessments', 'Biology Focused Modules', 'Exam Strategy Sessions']
    },
    'MHT-CET': {
        title: 'MHT-CET Preparation',
        duration: '1-2 Years',
        subjects: 'Physics, Chemistry, Mathematics, Biology',
        description: 'Focused preparation for Maharashtra entrance examination.',
        features: ['MHT-CET Experts', 'Exam Pattern Training', 'Speed & Accuracy Focus', 'Multiple Mock Tests', 'Question Bank Access']
    },
    'Science 11-12': {
        title: 'Science Stream (Class 11-12)',
        duration: 'Full Academic Year (Class 11 & 12)',
        subjects: 'Physics, Chemistry, Mathematics/Biology, English',
        description: 'Advanced science curriculum combining board examination requirements with competitive exam preparation. Designed for students pursuing engineering or medical careers.',
        features: ['Expert Science Faculty', 'PCM & PCB Tracks', 'Dual Focus - Board & Competitive Exams', 'Regular Laboratory Practice', 'Advanced Concept Clarity', 'Mock Tests & Assessments']
    },
    'Commerce 11-12': {
        title: 'Commerce Stream (Class 11-12)',
        duration: 'Full Academic Year (Class 11 & 12)',
        subjects: 'Accountancy, Economics, Business Studies, Mathematics, English',
        description: 'Comprehensive commerce education preparing students for board exams and university entrance. Ideal for students aspiring for CA, CS, MBA, and commerce-related careers.',
        features: ['Expert Commerce Faculty', 'Practical Accounting Training', 'Economics & Business Expertise', 'Mathematical Problem Solving', 'Case Study Approach', 'Regular Assessments & Feedback']
    }
};

document.querySelectorAll('[data-bs-target="#courseModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const course = this.getAttribute('data-course');
        const details = courseDetails[course];
        
        if (details) {
            courseModalBody.innerHTML = `
                <div class="course-details">
                    <h4 class="mb-3">${details.title}</h4>
                    <div class="course-detail-item mb-3">
                        <strong>Duration:</strong> ${details.duration}
                    </div>
                    <div class="course-detail-item mb-3">
                        <strong>Subjects:</strong> ${details.subjects}
                    </div>
                    <div class="course-detail-item mb-3">
                        <strong>Description:</strong> ${details.description}
                    </div>
                    <div class="course-detail-item mb-3">
                        <strong>Key Features:</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem;">
                            ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    });
});

// ========== FORM INPUT FORMATTING ==========
const phoneInputs = document.querySelectorAll('input[name="mobile"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    });
});

// ========== MOBILE MENU CLOSE ON OUTSIDE CLICK ==========
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        if (!navbar.contains(e.target)) {
            navbarToggler.click();
        }
    }
});

// ========== PLACEHOLDER IMAGE HANDLING ==========
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22%3EImage Placeholder%3C/text%3E%3C/svg%3E';
        this.style.backgroundColor = '#f0f0f0';
    });
});

// ========== VIDEO FALLBACK ==========
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('error', function() {
        this.style.display = 'none';
    });
}

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
    // Close modal on Escape
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const bootstrapModal = window.bootstrap.Modal.getOrCreateInstance(modal);
            bootstrapModal.hide();
        });
    }
    
    // Back to top on Ctrl+Home
    if (e.ctrlKey && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ========== DARK MODE TOGGLE (Optional - Commented) ==========
/*
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
*/

// ========== PAGE LOAD OPTIMIZATION ==========
window.addEventListener('load', () => {
    // Remove loading spinner if any
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
    
    // Initialize popovers and tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// ========== PERFORMANCE MONITORING ==========
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    });
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Add focus outline to interactive elements
document.querySelectorAll('a, button, input, select, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// ========== CONSOLE LOG ==========
console.log('%c BE RANGERS COACHING', 'font-size: 24px; font-weight: bold; color: #C9A227; font-family: Arial;');
console.log('%c Premium Coaching Website', 'font-size: 14px; color: #0B1F3A;');
console.log('Website by ARC Stack Web Studio');
