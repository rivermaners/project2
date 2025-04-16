document.addEventListener('DOMContentLoaded', function() {
  // 1. Dynamic Copyright Year
  function updateCopyrightYear() {
    try {
      const yearElement = document.getElementById('year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error('Copyright year update failed:', error);
    }
  }

  // 2. Smooth Scrolling for Anchor Links
  function setupSmoothScrolling() {
    try {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, targetId);
            } else {
              location.hash = targetId;
            }
          }
        });
      });
    } catch (error) {
      console.error('Smooth scrolling setup failed:', error);
    }
  }

  // 3. Form Submission Handling
  function handleFormSubmission() {
    const applicationForm = document.querySelector('.application-form');
    if (!applicationForm) return;

    try {
      applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
          // In a real implementation, you would use fetch() here
          // await submitFormData(new FormData(this));
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Show success feedback
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success';
          successMessage.textContent = 'Thank you for your application! We will contact you soon.';
          successMessage.setAttribute('role', 'alert');
          applicationForm.prepend(successMessage);
          
          // Reset form
          this.reset();
          
          // Hide message after delay
          setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
          }, 5000);
        } catch (error) {
          console.error('Form submission error:', error);
          alert('There was an error submitting your form. Please try again.');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    } catch (error) {
      console.error('Form handler setup failed:', error);
    }
  }

  // 4. Lazy Loading Images with Intersection Observer
  function setupLazyLoading() {
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Handle both data-src and regular src
            const src = img.dataset.src || img.src;
            if (!src) return;
            
            img.src = src;
            img.removeAttribute('data-src');
            
            // Add fade-in effect
            img.style.opacity = '0';
            img.onload = () => {
              img.style.transition = 'opacity 0.5s ease';
              img.style.opacity = '1';
            };
            
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(img => {
        if (img.complete) return;
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }

  // 5. Back-to-Top Button
  function setupBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    // Throttle scroll events for performance
    let isScrolling;
    window.addEventListener('scroll', () => {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        const showButton = window.pageYOffset > 300;
        backToTopBtn.style.display = showButton ? 'block' : 'none';
        backToTopBtn.setAttribute('aria-hidden', !showButton);
      }, 50);
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      backToTopBtn.blur(); // Remove focus after click
    });
  }

  // 6. Mobile Navigation Toggle
  function setupMobileNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const navToggle = document.createElement('button');
    navToggle.className = 'mobile-nav-toggle';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'main-navigation');
    navToggle.setAttribute('aria-label', 'Menu');
    navToggle.innerHTML = '<span class="sr-only">Menu</span><i class="fas fa-bars"></i>';
    navbar.prepend(navToggle);

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    navLinks.id = 'main-navigation';

    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      navToggle.innerHTML = isExpanded 
        ? '<span class="sr-only">Menu</span><i class="fas fa-bars"></i>' 
        : '<span class="sr-only">Close menu</span><i class="fas fa-times"></i>';
      
      // Toggle body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          toggleMenu();
        }
      });
    });

    function handleResize() {
      if (window.innerWidth > 992) {
        navLinks.style.display = 'flex';
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<span class="sr-only">Menu</span><i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
      } else {
        navLinks.style.display = 'none';
      }
    }

    // Use debounce for resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    });

    handleResize(); // Initialize
  }

  // Initialize all functions
  function init() {
    updateCopyrightYear();
    setupSmoothScrolling();
    handleFormSubmission();
    setupLazyLoading();
    setupBackToTopButton();
    setupMobileNavigation();
  }

  init();
});