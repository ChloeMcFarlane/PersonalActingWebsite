// IMAGE IMPORTS
// import image1 from 'src/Headshot1.jpg';
// import image2 from 'src/Headshot2.jpg';
// import image3 from 'src/Headshot3.jpg';
// import image4 from 'src/Headshot4.jpg';
// import image5 from 'src/Headshot5.jpg';
// import image6 from 'src/Headshot6.jpg';
// import image7 from 'src/Headshot7.jpg';
// ========================================
// GALLERY DATA
// ========================================
const galleryItems = [
  { 
    id: 0, 
    thumb: '../src/Headshot1.jpg', 
    full: '../src/Headshot1.jpg', 
    filter: 'one', 
    alt: 'Theatre' 
  },
  { 
    id: 1, 
    thumb: '../src/Headshot2.jpg', 
    full: '../src/Headshot2.jpg', 
    filter: 'one', 
    alt: 'Theatre' 
  },
  { 
    id: 2, 
    thumb: '../src/Headshot3.jpg', 
    full: '../src/Headshot3.jpg', 
    filter: 'two', 
    alt: 'Print' 
  },
  { 
    id: 3, 
    thumb: '../src/Headshot4.jpg', 
    full: '../src/Headshot4.jpg', 
    filter: 'two', 
    alt: 'Print' 
  },
  { 
    id: 4, 
    thumb: '../src/Headshot5.jpg', 
    full: '../src/Headshot5.jpg', 
    filter: 'three', 
    alt: 'Digitals' 
  },
  { 
    id: 5, 
    thumb: '../src/Headshot6.jpg', 
    full: '../src/Headshot6.jpg', 
    filter: 'three', 
    alt: 'Digitals' 
  },
  { 
    id: 6, 
    thumb: '../src/Headshot7.jpg', 
    full: '../src/Headshot7.jpg', 
    filter: 'four', 
    alt: 'Stills' 
  },
];

// ========================================
// STATE MANAGEMENT
// ========================================
const state = {
  activeFilter: 'all',
  currentImageIndex: null,
  filteredItems: [...galleryItems],
  isTransitioning: false
};

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
  galleryGrid: document.getElementById('galleryGrid'),
  overlay: document.getElementById('imageOverlay'),
  overlayImage: document.getElementById('overlayImage'),
  closeBtn: document.querySelector('.close-btn'),
  prevBtn: document.querySelector('.prev-btn'),
  nextBtn: document.querySelector('.next-btn'),
  filterBtns: document.querySelectorAll('.filter-btn')
};

// ========================================
// GALLERY RENDERING
// ========================================

/**
 * Renders all gallery items to the DOM
 * Uses DocumentFragment for optimal performance
 */
function renderGallery() {
  const fragment = document.createDocumentFragment();
  
  galleryItems.forEach((item) => {
    const galleryItem = createGalleryItem(item);
    fragment.appendChild(galleryItem);
  });
  
  elements.galleryGrid.appendChild(fragment);
}

/**
 * Creates a single gallery item element
 * @param {Object} item - Gallery item data
 * @returns {HTMLElement} - Gallery item element
 */
function createGalleryItem(item) {
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.dataset.filter = item.filter;
  div.dataset.id = item.id;
  
  div.innerHTML = `
    <div class="image-wrapper">
      <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
    </div>
    <div class="btn-overlay">
      <button class="view-btn">View</button>
    </div>
  `;
  
  // Add click handlers
  const imageWrapper = div.querySelector('.image-wrapper');
  const viewBtn = div.querySelector('.view-btn');
  
  imageWrapper.addEventListener('click', () => openOverlay(item.id));
  viewBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openOverlay(item.id);
  });
  
  return div;
}

// ========================================
// FILTER FUNCTIONALITY
// ========================================

/**
 * Filters gallery items based on selected category
 * @param {string} filter - Filter category
 */
function filterGallery(filter) {
  state.activeFilter = filter;
  
  // Update filtered items array
  state.filteredItems = filter === 'all' 
    ? [...galleryItems]
    : galleryItems.filter(item => item.filter === filter);
  
  // Update DOM
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const itemFilter = item.dataset.filter;
    
    if (filter === 'all' || itemFilter === filter) {
      item.classList.remove('hidden');
      // Trigger reflow for animation
      item.offsetHeight;
    } else {
      item.classList.add('hidden');
    }
  });
}

/**
 * Updates active state of filter buttons
 * @param {HTMLElement} activeBtn - The clicked filter button
 */
function updateFilterButtons(activeBtn) {
  elements.filterBtns.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

/**
 * Sets up filter button event listeners
 */
function initializeFilterButtons() {
  elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      filterGallery(filter);
      updateFilterButtons(this);
    });
  });
}

// ========================================
// OVERLAY FUNCTIONALITY
// ========================================

/**
 * Opens the image overlay modal
 * @param {number} imageId - ID of the image to display
 */
function openOverlay(imageId) {
  const index = state.filteredItems.findIndex(item => item.id === imageId);
  
  if (index === -1) return;
  
  state.currentImageIndex = index;
  const item = state.filteredItems[index];
  
  elements.overlayImage.src = item.full;
  elements.overlayImage.alt = item.alt;
  elements.overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the image overlay modal
 */
function closeOverlay() {
  elements.overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
  state.currentImageIndex = null;
}

/**
 * Navigates to the next image in the filtered collection
 */
function nextImage() {
  if (state.currentImageIndex === null || state.isTransitioning) return;
  
  state.isTransitioning = true;
  elements.overlayImage.classList.add('transitioning');
  
  setTimeout(() => {
    const nextIndex = (state.currentImageIndex + 1) % state.filteredItems.length;
    state.currentImageIndex = nextIndex;
    
    const item = state.filteredItems[nextIndex];
    elements.overlayImage.src = item.full;
    elements.overlayImage.alt = item.alt;
    
    elements.overlayImage.classList.remove('transitioning');
    state.isTransitioning = false;
  }, 200);
}

/**
 * Navigates to the previous image in the filtered collection
 */
function prevImage() {
  if (state.currentImageIndex === null || state.isTransitioning) return;
  
  state.isTransitioning = true;
  elements.overlayImage.classList.add('transitioning');
  
  setTimeout(() => {
    const prevIndex = (state.currentImageIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
    state.currentImageIndex = prevIndex;
    
    const item = state.filteredItems[prevIndex];
    elements.overlayImage.src = item.full;
    elements.overlayImage.alt = item.alt;
    
    elements.overlayImage.classList.remove('transitioning');
    state.isTransitioning = false;
  }, 200);
}

/**
 * Sets up overlay event listeners
 */
function initializeOverlay() {
  // Close button
  elements.closeBtn.addEventListener('click', closeOverlay);
  
  // Navigation buttons
  elements.prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });
  
  elements.nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });
  
  // Click outside to close
  elements.overlay.addEventListener('click', (e) => {
    if (e.target === elements.overlay) {
      closeOverlay();
    }
  });
  
  // Prevent clicks on overlay-inner from closing
  document.querySelector('.overlay-inner').addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

/**
 * Handles keyboard events for overlay navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyboardNavigation(e) {
  if (state.currentImageIndex === null) return;
  
  switch(e.key) {
    case 'Escape':
      closeOverlay();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case 'ArrowLeft':
      prevImage();
      break;
  }
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

/**
 * Implements lazy loading for images
 * Uses Intersection Observer API for better performance
 */
function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Preloads the next and previous images for smooth transitions
 */
function preloadAdjacentImages() {
  if (state.currentImageIndex === null) return;
  
  const nextIndex = (state.currentImageIndex + 1) % state.filteredItems.length;
  const prevIndex = (state.currentImageIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
  
  const preloadNext = new Image();
  const preloadPrev = new Image();
  
  preloadNext.src = state.filteredItems[nextIndex].full;
  preloadPrev.src = state.filteredItems[prevIndex].full;
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initializes the gallery application
 */
function init() {
  // Render gallery
  renderGallery();
  
  // Initialize components
  initializeFilterButtons();
  initializeOverlay();
  initializeLazyLoading();
  
  // Set up keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Preload adjacent images when overlay changes
  elements.overlayImage.addEventListener('load', preloadAdjacentImages);
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
