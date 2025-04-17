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

  // 6. Mobile Navigation with Dropdown Support
  function setupMobileNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Check if mobile toggle already exists
    let navToggle = document.querySelector('.mobile-nav-toggle');
    if (!navToggle) {
      navToggle = document.createElement('button');
      navToggle.className = 'mobile-nav-toggle';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-controls', 'main-navigation');
      navToggle.setAttribute('aria-label', 'Menu');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      navbar.appendChild(navToggle);
    }

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    navLinks.id = 'main-navigation';

    // Function to toggle mobile menu
    function toggleMenu() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      navToggle.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
      document.body.style.overflow = isExpanded ? '' : 'hidden';
      
      // Close all dropdowns when menu closes
      if (isExpanded) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    }

    // Setup dropdown functionality
    function setupDropdowns() {
      const dropdownToggles = document.querySelectorAll('.dropdown > a');
      
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown').forEach(item => {
              if (item !== dropdown) {
                item.classList.remove('active');
              }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
          }
        });
      });
      
      // Close dropdowns when clicking outside
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && !e.target.closest('.mobile-nav-toggle')) {
          document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
          });
        }
      });
    }

    // Initialize dropdowns
    setupDropdowns();

    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on a nav link (mobile only)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768 && !link.parentElement.classList.contains('dropdown')) {
          toggleMenu();
        }
      });
    });

    // Handle window resize
    function handleResize() {
      if (window.innerWidth > 768) {
        // Reset mobile menu
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
        
        // Reset dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    }

    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
        setupDropdowns(); // Re-setup dropdown event listeners
      }, 100);
    });

    // Initialize based on current screen size
    if (window.innerWidth <= 768) {
      navLinks.classList.remove('active');
    }
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