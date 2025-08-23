// Simple JavaScript interactivity
function showAlert() {
  alert("Welcome to Joshi Hospital – Providing healthcare since 1982!");
}

// Example: Add current year automatically in footer
document.addEventListener("DOMContentLoaded", function() {
  const footer = document.querySelector("footer p");
  const year = new Date().getFullYear();
  footer.innerHTML = `&copy; ${year} Joshi Hospital, Shirdi | All Rights Reserved`;
});

// Additional interactivity for better user experience
document.addEventListener("DOMContentLoaded", function() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Contact form submission handler
  const contactForm = document.querySelector('.contact-form form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const phone = this.querySelector('input[type="tel"]').value;
      const message = this.querySelector('textarea').value;
      
      // Simple validation
      if (!name || !email || !message) {
        alert('Please fill in all required fields (Name, Email, and Message).');
        return;
      }
      
      // Simulate form submission
      alert(`Thank you, ${name}! Your message has been received. We will contact you soon at ${email}.`);
      
      // Reset form
      this.reset();
    });
  }

  // Add active state to navigation based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-menu a[href^="#"]');

  function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = '#' + section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === current) {
        item.classList.add('active');
      }
    });
  }

  // Update active nav on scroll
  window.addEventListener('scroll', updateActiveNav);
  
  // Initial call
  updateActiveNav();

  // Add animation on scroll for service cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe service cards and doctor cards
  const cards = document.querySelectorAll('.service-card, .doctor-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
});