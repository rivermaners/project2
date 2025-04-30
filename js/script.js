document.addEventListener("DOMContentLoaded", function () {
  function updateCopyrightYear() {
    try {
      const yearElement = document.getElementById("year");
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error("Copyright year update failed:", error);
    }
  }

  function setupSmoothScrolling() {
    try {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const targetId = this.getAttribute("href");
          if (targetId === "#") return;

          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });

            if (history.pushState) {
              history.pushState(null, null, targetId);
            } else {
              location.hash = targetId;
            }
          }
        });
      });
    } catch (error) {
      console.error("Smooth scrolling setup failed:", error);
    }
  }

  function handleFormSubmission() {
    const applicationForm = document.querySelector(".application-form");
    if (!applicationForm) return;

    try {
      applicationForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Processing...";
        submitBtn.disabled = true;

        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const successMessage = document.createElement("div");
          successMessage.className = "form-success";
          successMessage.textContent =
            "Thank you for your application! We will contact you soon.";
          successMessage.setAttribute("role", "alert");
          applicationForm.prepend(successMessage);

          this.reset();

          setTimeout(() => {
            successMessage.style.opacity = "0";
            setTimeout(() => successMessage.remove(), 300);
          }, 5000);
        } catch (error) {
          console.error("Form submission error:", error);
          alert("There was an error submitting your form. Please try again.");
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
    } catch (error) {
      console.error("Form handler setup failed:", error);
    }
  }

  function setupLazyLoading() {
    const lazyImages = [].slice.call(
      document.querySelectorAll('img[loading="lazy"]')
    );
    if (!lazyImages.length) return;

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;

              const src = img.dataset.src || img.src;
              if (!src) return;

              img.src = src;
              img.removeAttribute("data-src");

              img.style.opacity = "0";
              img.onload = () => {
                img.style.transition = "opacity 0.5s ease";
                img.style.opacity = "1";
              };

              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "200px 0px",
          threshold: 0.01,
        }
      );

      lazyImages.forEach((img) => {
        if (img.complete) return;
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach((img) => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    }
  }

  function setupBackToTopButton() {
    const backToTopBtn = document.createElement("button");
    backToTopBtn.className = "back-to-top";
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.innerHTML = "↑";
    document.body.appendChild(backToTopBtn);

    let isScrolling;
    window.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          const showButton = window.pageYOffset > 300;
          backToTopBtn.style.display = showButton ? "block" : "none";
          backToTopBtn.setAttribute("aria-hidden", !showButton);
        }, 50);
      },
      { passive: true }
    );

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      backToTopBtn.blur();
    });
  }

  function setupMobileNavigation() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let navToggle = document.querySelector(".mobile-nav-toggle");
    if (!navToggle) {
      navToggle = document.createElement("button");
      navToggle.className = "mobile-nav-toggle";
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-controls", "main-navigation");
      navToggle.setAttribute("aria-label", "Menu");
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      navbar.appendChild(navToggle);
    }

    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) return;
    navLinks.id = "main-navigation";

    function toggleMenu() {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
      navToggle.innerHTML = isExpanded
        ? '<i class="fas fa-bars"></i>'
        : '<i class="fas fa-times"></i>';
      document.body.style.overflow = isExpanded ? "" : "hidden";

      if (isExpanded) {
        document.querySelectorAll(".dropdown").forEach((dropdown) => {
          dropdown.classList.remove("active");
        });
      }
    }

    function setupDropdowns() {
      const dropdownToggles = document.querySelectorAll(".dropdown > a");

      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;

            document.querySelectorAll(".dropdown").forEach((item) => {
              if (item !== dropdown) {
                item.classList.remove("active");
              }
            });

            dropdown.classList.toggle("active");
          }
        });
      });

      document.addEventListener("click", function (e) {
        if (
          !e.target.closest(".dropdown") &&
          !e.target.closest(".mobile-nav-toggle")
        ) {
          document.querySelectorAll(".dropdown").forEach((dropdown) => {
            dropdown.classList.remove("active");
          });
        }
      });
    }

    setupDropdowns();

    navToggle.addEventListener("click", toggleMenu);

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (
          window.innerWidth <= 768 &&
          !link.parentElement.classList.contains("dropdown")
        ) {
          toggleMenu();
        }
      });
    });

    function handleResize() {
      if (window.innerWidth > 768) {
        navLinks.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = "";

        document.querySelectorAll(".dropdown").forEach((dropdown) => {
          dropdown.classList.remove("active");
        });
      }
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
        setupDropdowns();
      }, 100);
    });

    if (window.innerWidth <= 768) {
      navLinks.classList.remove("active");
    }
  }

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
