// Simple JavaScript for enhanced UX
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lottie animation
    const heroAnimationContainer = document.getElementById('hero-animation');
    
    if (heroAnimationContainer && typeof lottie !== 'undefined') {
        const animation = lottie.loadAnimation({
            container: heroAnimationContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/hero-animation.json',
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        });
        
        // Force the animation to fill the container
        animation.addEventListener('DOMLoaded', function() {
            const svgElement = heroAnimationContainer.querySelector('svg');
            if (svgElement) {
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', '100%');
                svgElement.setAttribute('viewBox', svgElement.getAttribute('viewBox'));
                svgElement.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            }
        });
        
        // Optional: Reduce animation speed for a more subtle effect
        animation.setSpeed(0.8);
    }

    // Initialize skyline animation
    initSkylineAnimation();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize intersection observer for pain points section
    initPainPointsAnimation();
    
    // Initialize services section scroll animation
    initServicesAnimation();
    
    // Initialize diagnostic functionality
    initDiagnostic();
    
    // Initialize rotating startup truths
    initStartupTruths();
});

function initSkylineAnimation() {
    const skylineContainer = document.getElementById('skyline-animation');
    if (skylineContainer) {
        const skylineAnimation = lottie.loadAnimation({
            container: skylineContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/skyline-animation.json'
        });
        
        // Store reference for scroll effects
        window.skylineAnimation = skylineAnimation;
    }
}

function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const skylineElement = document.getElementById('skyline-animation');
        const painPointsSection = document.querySelector('.pain-points');
        
        if (skylineElement && painPointsSection) {
            const rect = painPointsSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the section is visible
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;
            
            // Check if section is in viewport
            const isVisible = sectionTop < windowHeight && sectionBottom > 0;
            
            if (isVisible) {
                // Calculate scroll progress through the section (0 to 1)
                let scrollProgress;
                
                if (sectionTop <= 0) {
                    // Section is scrolling up through viewport
                    scrollProgress = Math.abs(sectionTop) / sectionHeight;
                } else {
                    // Section is entering viewport from bottom
                    scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
                }
                
                // Clamp between 0 and 1
                scrollProgress = Math.max(0, Math.min(1, scrollProgress));
                
                // Create smooth upward movement of skyline (opposite to scroll direction)
                const maxTranslateY = -80; // Maximum upward movement in pixels
                const translateY = scrollProgress * maxTranslateY;
                
                // Apply transform with hardware acceleration
                skylineElement.style.transform = `translate3d(0, ${translateY}px, 0)`;
                
                // Gradually increase opacity as section becomes more visible
                const opacity = 0.6 + (scrollProgress * 0.3); // From 0.6 to 0.9
                skylineElement.style.opacity = opacity;
                
                // Add scroll-active class for additional CSS effects
                painPointsSection.classList.add('scroll-active');
            } else {
                // Reset when section is not visible
                skylineElement.style.transform = 'translate3d(0, 0, 0)';
                skylineElement.style.opacity = '0.8';
                painPointsSection.classList.remove('scroll-active');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
}

function initPainPointsAnimation() {
    const painPointsSection = document.querySelector('.pain-points');
    const painItems = document.querySelectorAll('.pain-item');
    const painConclusion = document.querySelector('.pain-conclusion');
    const painTitle = document.querySelector('.pain-points h2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title first
                setTimeout(() => {
                    if (painTitle) painTitle.classList.add('animated');
                }, 200);
                
                // Animate pain items with staggered delays
                painItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                    }, 400 + (index * 200));
                });
                
                // Animate conclusion last
                setTimeout(() => {
                    if (painConclusion) painConclusion.classList.add('animated');
                }, 1200);
                
                // Add section-level animation class
                painPointsSection.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    if (painPointsSection) {
        observer.observe(painPointsSection);
    }
}

function initServicesAnimation() {
    const servicesSection = document.querySelector('.services');
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceTitle = document.querySelector('.services h2');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title first
                setTimeout(() => {
                    if (serviceTitle) serviceTitle.classList.add('animated');
                }, 200);
                
                // Animate service items with staggered delays
                serviceItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                    }, 400 + (index * 200));
                });
                
                // Add section-level animation class
                servicesSection.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    if (servicesSection) {
        observer.observe(servicesSection);
    }
}

function initDiagnostic() {
    const checkboxes = document.querySelectorAll('.diagnostic-checkbox');
    const resultDiv = document.getElementById('diagnostic-result');
    
    function updateResult() {
        const uncheckedCount = Array.from(checkboxes).filter(cb => !cb.checked).length;
        
        if (uncheckedCount >= 3) {
            resultDiv.classList.add('show');
        } else {
            resultDiv.classList.remove('show');
        }
    }
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateResult);
    });
}

// Smooth scroll for CTA buttons
const ctaButtons = document.querySelectorAll('a[href^="#"]');

ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
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

function initStartupTruths() {
    const truths = [
        "We prioritize your needs above all.",
        "Innovation is at the heart of what we do.",
        "We believe in transparent communication.",
        "Your success is our mission.",
        "We are committed to continuous improvement."
    ];
    
    const truthsContainer = document.getElementById('startup-truths');
    let currentIndex = 0;
    
    if (truthsContainer) {
        // Set initial truth
        truthsContainer.textContent = truths[currentIndex];
        
        // Rotate truths every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % truths.length;
            truthsContainer.classList.remove('fade-in');
            
            // Trigger reflow to restart animation
            void truthsContainer.offsetWidth;
            
            truthsContainer.textContent = truths[currentIndex];
            truthsContainer.classList.add('fade-in');
        }, 5000);
    }
}