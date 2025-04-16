document.addEventListener('DOMContentLoaded', function() {
  // 1. Dynamic Copyright Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // 2. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // 3. Form Submission Handling
  const applicationForm = document.querySelector('.application-form');
  if (applicationForm) {
    applicationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
        // Show success message
        alert('Thank you for your application! We will contact you soon.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        this.reset();
      }, 1500);
    });
  }

  // 4. Lazy Loading Images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // 5. Back-to-Top Button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.innerHTML = '↑';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    backToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 6. Mobile Navigation Toggle
  const navToggle = document.createElement('button');
  navToggle.className = 'mobile-nav-toggle';
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Menu');
  navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  document.querySelector('.navbar').prepend(navToggle);

  const navLinks = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.style.display = isExpanded ? 'none' : 'flex';
    navToggle.innerHTML = isExpanded ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
  });

  // Handle window resize
  function handleResize() {
    if (window.innerWidth > 992) {
      navLinks.style.display = 'flex';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      navLinks.style.display = 'none';
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // Initialize
});



