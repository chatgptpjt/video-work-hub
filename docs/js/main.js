/**
 * MET動画編集チーム - メインJavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initWorksGrid();
  initCategoryFilter();
  initModal();
  initScrollAnimations();
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader();
}

/**
 * Mobile navigation
 */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-overlay .nav-link');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Render works grid
 */
function initWorksGrid() {
  const grid = document.querySelector('.works-grid');
  if (!grid) return;

  renderWorks(WORKS);
}

function renderWorks(works) {
  const grid = document.querySelector('.works-grid');
  if (!grid) return;

  grid.innerHTML = works.map(work => createWorkCard(work)).join('');

  // Add click handlers
  grid.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      const workId = parseInt(card.dataset.id);
      const work = WORKS.find(w => w.id === workId);
      if (work) {
        openModal(work);
      }
    });
  });

  // Re-apply fade-in for new elements
  initScrollAnimations();
}

function createWorkCard(work) {
  const category = CATEGORIES.find(c => c.id === work.category);
  const categoryLabel = category ? category.label : work.category;

  return `
    <article class="work-card fade-in" data-id="${work.id}" data-category="${work.category}">
      <div class="work-thumbnail">
        ${work.thumbnail
          ? `<img src="${work.thumbnail}" alt="${work.title}">`
          : `<div class="placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm4.5 6l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>`
        }
        <div class="play-overlay">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div class="work-info">
        <span class="work-category">${categoryLabel}</span>
        <h3 class="work-title">${work.title}</h3>
        <p class="work-description">${work.description}</p>
      </div>
    </article>
  `;
}

/**
 * Category filter
 */
function initCategoryFilter() {
  const filterContainer = document.querySelector('.category-filter');
  if (!filterContainer) return;

  // Render filter buttons
  filterContainer.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn${cat.id === 'all' ? ' active' : ''}" data-category="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  // Add click handlers
  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter works
      const category = btn.dataset.category;
      const filteredWorks = category === 'all'
        ? WORKS
        : WORKS.filter(w => w.category === category);

      renderWorks(filteredWorks);
    });
  });
}

/**
 * Video modal
 */
function initModal() {
  const modal = document.querySelector('.modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(work) {
  const modal = document.querySelector('.modal');
  const videoContainer = modal.querySelector('.modal-video');

  if (work.videoUrl) {
    // Embed video (support for YouTube, etc.)
    if (work.videoUrl.includes('youtube.com') || work.videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(work.videoUrl);
      videoContainer.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      `;
    } else {
      videoContainer.innerHTML = `
        <video controls autoplay style="width:100%;height:100%;">
          <source src="${work.videoUrl}" type="video/mp4">
        </video>
      `;
    }
  } else {
    videoContainer.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <p style="margin-bottom:20px;">動画準備中</p>
        <p style="font-size:0.9rem;opacity:0.7;">${work.title}</p>
      </div>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.querySelector('.modal');
  const videoContainer = modal.querySelector('.modal-video');

  modal.classList.remove('active');
  document.body.style.overflow = '';

  // Clear video to stop playback
  setTimeout(() => {
    videoContainer.innerHTML = '';
  }, 300);
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in:not(.visible)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
