// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const downloadResumeBtn = document.getElementById('download-resume');
const contactForm = document.getElementById('contact-form');
const projectSearch = document.getElementById('project-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectsGrid = document.getElementById('projects-grid');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Initialize theme
setTheme(currentTheme);

// Theme toggle event
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const offsetTop = target.offsetTop - navbarHeight - 20; // Extra 20px buffer
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - navbarHeight - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skills animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillsSection = document.getElementById('skills');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
};

// Intersection Observer for skills animation
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Project filtering and search
let allProjects = [];

function initializeProjects() {
    const projectCards = document.querySelectorAll('.project-card');
    allProjects = Array.from(projectCards).map(card => ({
        element: card,
        category: card.getAttribute('data-category') || '',
        title: card.querySelector('h3').textContent.toLowerCase(),
        description: card.querySelector('p').textContent.toLowerCase(),
        tech: Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase())
    }));
}

function filterProjects(category = 'all', searchTerm = '') {
    allProjects.forEach(project => {
        const matchesCategory = category === 'all' || project.category.includes(category);
        const matchesSearch = searchTerm === '' || 
            project.title.includes(searchTerm.toLowerCase()) ||
            project.description.includes(searchTerm.toLowerCase()) ||
            project.tech.some(tech => tech.includes(searchTerm.toLowerCase()));
        
        if (matchesCategory && matchesSearch) {
            project.element.style.display = 'block';
            project.element.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            project.element.style.display = 'none';
        }
    });
}

// Filter button events
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');
        const searchTerm = projectSearch.value;
        filterProjects(category, searchTerm);
    });
});

// Search input event
if (projectSearch) {
    projectSearch.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        filterProjects(activeFilter, e.target.value);
    });
}

// Initialize projects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProjects();
});

// Testimonials carousel
let currentTestimonial = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('testimonial-prev');
const nextBtn = document.getElementById('testimonial-next');

function showTestimonial(index) {
    testimonialSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
    showTestimonial(currentTestimonial);
}

// Testimonial event listeners
if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-rotate testimonials
setInterval(nextTestimonial, 5000);

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Resume download functionality
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
        generateResumePDF();
    });
}

function generateResumePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(20);
    doc.text('Sanket Desai', 20, 30);
    
    doc.setFontSize(14);
    doc.text('Web Developer & Certified Java Developer', 20, 45);
    
    doc.setFontSize(12);
    doc.text('Email: sanketdesai1971@gmail.com', 20, 60);
    doc.text('Location: Pune, Maharashtra, India', 20, 70);
    
    doc.setFontSize(16);
    doc.text('About', 20, 90);
    doc.setFontSize(10);
    const aboutText = 'Passionate web developer with expertise in Java, Spring Boot, React, and Node.js. Certified Java developer with Grade A+ from Profound Edutech Institute, Pune.';
    const splitAbout = doc.splitTextToSize(aboutText, 170);
    doc.text(splitAbout, 20, 100);
    
    doc.setFontSize(16);
    doc.text('Skills', 20, 130);
    doc.setFontSize(10);
    doc.text('• Backend: Java, Spring Boot, Node.js, Express.js, REST API', 20, 140);
    doc.text('• Frontend: React.js, JavaScript, HTML/CSS', 20, 150);
    doc.text('• Database: MySQL, MongoDB, JPA', 20, 160);
    doc.text('• Tools: Authentication, Maven, Postman, VS Code', 20, 170);
    
    doc.setFontSize(16);
    doc.text('Projects', 20, 190);
    doc.setFontSize(12);
    doc.text('E-commerce Backend', 20, 200);
    doc.setFontSize(10);
    doc.text('Production-ready backend with Java, Spring Boot, and MySQL', 20, 210);
    
    doc.setFontSize(12);
    doc.text('Stack Overflow Clone', 20, 225);
    doc.setFontSize(10);
    doc.text('Full-stack platform built with React, Node.js, and MongoDB', 20, 235);
    
    // Save the PDF
    doc.save('Sanket_Desai_Resume.pdf');
    
    showNotification('Resume downloaded successfully!', 'success');
}

// Blog posts fetching (Medium RSS)
async function fetchBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    const blogLoading = document.getElementById('blog-loading');
    
    try {
        // Note: Medium RSS requires CORS proxy for client-side fetching
        // For production, implement server-side fetching or use Medium API
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@sanketdesai1971');
        const data = await response.json();
        
        if (data.status === 'ok' && data.items.length > 0) {
            blogLoading.style.display = 'none';
            
            // Display first 3 posts
            data.items.slice(0, 3).forEach(post => {
                const blogCard = createBlogCard(post);
                blogGrid.appendChild(blogCard);
            });
        } else {
            throw new Error('No blog posts found');
        }
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        blogLoading.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to load blog posts. <a href="https://medium.com/@sanketdesai1971" target="_blank">Visit Medium directly</a></p>
        `;
    }
}

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-aos', 'fade-up');
    
    const publishDate = new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Extract first image from content or use placeholder
    const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
    const imgSrc = imgMatch ? imgMatch[1] : 'https://via.placeholder.com/400x200/00AEEF/FFFFFF?text=Blog+Post';
    
    card.innerHTML = `
        <div class="blog-image" style="height: 200px; background: url('${imgSrc}') center/cover;">
            <div class="blog-overlay">
                <a href="${post.link}" target="_blank" class="blog-link">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
        <div class="blog-content" style="padding: 1.5rem;">
            <div class="blog-meta" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                <span><i class="fas fa-calendar"></i> ${publishDate}</span>
            </div>
            <h3 style="margin-bottom: 1rem; line-height: 1.3;">${post.title}</h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                ${post.description.substring(0, 120)}...
            </p>
            <a href="${post.link}" target="_blank" class="btn btn-sm">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
}

// Initialize blog posts
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogPosts();
});

// Typing animation for hero section
function typeWriter(element, text, speed = 100, callback = null) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 80);
        }, 1000);
    }
    
    // Typewriter effect for hero title name
    const heroName = document.querySelector('.hero-title .accent-text');
    if (heroName) {
        const nameText = heroName.textContent;
        heroName.textContent = '';
        heroName.style.borderRight = '3px solid var(--accent-color)';
        
        setTimeout(() => {
            typeWriter(heroName, nameText, 100, () => {
                // Start blinking cursor after typing
                setTimeout(() => {
                    heroName.style.animation = 'glow 2s ease-in-out infinite alternate, blink 1s infinite';
                }, 500);
            });
        }, 1500); // Start after hero title fades in
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-bg);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-medium);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        border-left: 4px solid var(--accent-color);
    }
    
    .notification-success {
        border-left-color: #28a745;
    }
    
    .notification-error {
        border-left-color: #dc3545;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar scroll effect
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('Portfolio loaded successfully! 🚀');
