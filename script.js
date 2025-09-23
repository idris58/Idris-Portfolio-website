// Scroll-to-Top
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Auto-update navbar active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80; // adjust for navbar height
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(`#${currentSection}`)) {
      link.classList.add('active');
    }
  });
});


// Filter Projects
document.querySelectorAll('.filter').forEach(filter => {
  filter.addEventListener('click', function(){
    document.querySelector('.filter.active').classList.remove('active');
    this.classList.add('active');
    const cat = this.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (cat==='all' || card.dataset.category.includes(cat)) ? 'block' : 'none';
    });
  });
});


// ========== Project Modal ==========
const modal = document.getElementById("projectModal");
const closeBtn = document.querySelector(".close-btn");

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let currentImageIndex = 0;
let currentImages = [];

// Open modal
document.querySelectorAll(".project-card .details").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    
    const card = this.closest(".project-card");
    const title = card.querySelector("h3").innerText;
    const github = card.querySelector(".github")?.href || "#";
    const description = card.getAttribute("data-description") || "Project details coming soon!";
    const images = card.getAttribute("data-images")?.split(",") || [card.querySelector("img").src];

    // Fill modal
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDescription").innerText = description;
    document.getElementById("modalGithub").href = github;

    // Add thumbnails
    const imageContainer = document.getElementById("modalImages");
    imageContainer.innerHTML = "";
    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src.trim();
      img.alt = title + " screenshot";
      img.classList.add("thumbnail");
      
      // Click thumbnail → open lightbox
      img.addEventListener("click", () => {
        openLightbox(images, i);
      });

      imageContainer.appendChild(img);
    });

    modal.style.display = "block";
  });
});

// Close modal
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target == modal) modal.style.display = "none";
});

// ========== Lightbox ==========
function openLightbox(images, index) {
  currentImages = images;
  currentImageIndex = index;
  lightbox.style.display = "flex";
  updateLightbox();
}

function updateLightbox() {
  lightboxImg.src = currentImages[currentImageIndex].trim();
}

// Arrows
lightboxPrev.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
});
lightboxNext.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateLightbox();
});

// Close
lightboxClose.addEventListener("click", () => lightbox.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target == lightbox) lightbox.style.display = "none";
});

// Keyboard navigation
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowLeft") {
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      updateLightbox();
    } else if (e.key === "ArrowRight") {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      updateLightbox();
    } else if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  }
});

// ===== Certificate Modal =====
const certModal = document.getElementById("certificateModal");
const certFrame = document.getElementById("certFrame");
const certImage = document.getElementById("certImage");
const certTitle = document.getElementById("certTitle");
const closeCert = document.querySelector(".close-cert");

document.querySelectorAll(".award-card .btn-show").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const card = this.closest(".award-card");
    const title = card.querySelector("h3").innerText;
    const fileLink = this.getAttribute("href");

    certTitle.innerText = title;

    // Reset views
    certFrame.style.display = "none";
    certImage.style.display = "none";
    certFrame.src = "";
    certImage.src = "";

    // Show PDF in iframe
    if (fileLink.endsWith(".pdf")) {
      certFrame.src = fileLink;
      certFrame.style.display = "block";
    } 
    // Show image
    else if (fileLink.match(/\.(jpg|jpeg|png|gif)$/i)) {
      certImage.src = fileLink;
      certImage.style.display = "block";
    }

    certModal.style.display = "block";
  });
});

// Close modal
closeCert.addEventListener("click", () => {
  certModal.style.display = "none";
  certFrame.src = "";
  certImage.src = "";
});

window.addEventListener("click", (e) => {
  if (e.target == certModal) {
    certModal.style.display = "none";
    certFrame.src = "";
    certImage.src = "";
  }
});

// ===== Contact Form with EmailJS =====
const form = document.getElementById("contactForm");
const spinner = document.getElementById("formSpinner");
const statusMsg = document.getElementById("formStatus");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Reset status
  statusMsg.style.display = "none";
  statusMsg.className = "form-status";

  // Show spinner
  spinner.style.display = "flex";

  emailjs.sendForm("service_6aro3l5", "template_yys6c8x", form)
    .then(() => {
      statusMsg.textContent = "Message sent successfully!";
      statusMsg.classList.add("success");
      statusMsg.style.display = "block";

      // Auto fade out after 6s
      setTimeout(() => {
        statusMsg.classList.add("fade-out");
        setTimeout(() => {
          statusMsg.style.display = "none";
          statusMsg.classList.remove("fade-out", "success", "error");
        }, 1000); // wait for fade-out animation
      }, 6000);
    })
    .catch(() => {
      statusMsg.textContent = "Failed to send message. Please try again.";
      statusMsg.classList.add("error");
      statusMsg.style.display = "block";

      // Auto fade out after 6s
      setTimeout(() => {
        statusMsg.classList.add("fade-out");
        setTimeout(() => {
          statusMsg.style.display = "none";
          statusMsg.classList.remove("fade-out", "success", "error");
        }, 1000);
      }, 6000);
    })
    .finally(() => {
      spinner.style.display = "none";
      form.reset();
    });
});

// ===== Mobile Menu Toggle =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinksMenu = document.querySelector('.nav-links');

function handleResize() {
  if (window.innerWidth <= 768) {
    mobileMenuToggle.style.display = 'block';
    navLinksMenu.classList.remove('show');
  } else {
    mobileMenuToggle.style.display = 'none';
    navLinksMenu.classList.remove('show');
    navLinksMenu.style.display = '';
  }
}

window.addEventListener('resize', handleResize);
window.addEventListener('DOMContentLoaded', handleResize);

mobileMenuToggle.addEventListener('click', () => {
  navLinksMenu.classList.toggle('show');
});

// Hide menu when a link is clicked (mobile only)
navLinksMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navLinksMenu.classList.remove('show');
    }
  });
});

// ===== Dark/Light Theme Toggle =====
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeToggle.innerHTML = '<i class="ri-moon-line"></i>'; // moon icon for dark mode
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.innerHTML = '<i class="ri-sun-line"></i>'; // sun icon for light mode
    localStorage.setItem("theme", "light");
  }
});


// Hamburger toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");

  // Toggle icon
  if (navLinks.classList.contains("show")) {
    hamburger.innerHTML = '<i class="ri-close-line"></i>';
  } else {
    hamburger.innerHTML = '<i class="ri-menu-line"></i>';
  }
});

// Close menu when clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    hamburger.innerHTML = '<i class="ri-menu-line"></i>';
  });
});
