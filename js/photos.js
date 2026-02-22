// ========================================
// NAV HAMBURGER
// ========================================
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});


// ========================================
// GALLERY DATA
// Update thumb/full paths to match your actual image filenames.
// filter: 'one' = Theatre, 'two' = Marketing, 'three' = Headshots
// ========================================
const galleryItems = [
    { id: 0,  thumb: '../src/prodphotos/topgirls1.jpg',    full: '../src/prodphotos/topgirls1.jpg',    filter: 'one',   alt: 'Theatre' },
    { id: 1,  thumb: '../src/prodphotos/topgirls2.jpg',    full: '../src/prodphotos/topgirls2.jpg',    filter: 'one',   alt: 'Theatre' },
    { id: 2,  thumb: '../src/prodphotos/topgirls3.jpg',    full: '../src/prodphotos/topgirls3.jpg',    filter: 'one',   alt: 'Theatre' },
    { id: 3,  thumb: '../src/prodphotos/dirspro1.jpg',     full: '../src/prodphotos/dirspro1.jpg',     filter: 'two',   alt: 'Marketing' },
    { id: 4,  thumb: '../src/prodphotos/dirspro2.jpg',     full: '../src/prodphotos/dirspro2.jpg',     filter: 'one',   alt: 'Theatre' },
    { id: 5,  thumb: '../src/prodphotos/dirspro4.jpg',     full: '../src/prodphotos/dirspro4.jpg',     filter: 'one',   alt: 'Theatre' },
    { id: 6,  thumb: '../src/headshots/headshot1.jpg',     full: '../src/headshots/headshot1.jpg',     filter: 'three', alt: 'Headshots' },
    { id: 7,  thumb: '../src/headshots/headshot2.jpg',     full: '../src/headshots/headshot2.jpg',     filter: 'three', alt: 'Headshots' },
    { id: 8,  thumb: '../src/headshots/headshot3.jpg',     full: '../src/headshots/headshot3.jpg',     filter: 'three', alt: 'Headshots' },
];


// ========================================
// STATE
// ========================================
const state = {
    activeFilter:      'all',
    currentImageIndex: null,
    filteredItems:     [...galleryItems],
    isTransitioning:   false,
};


// ========================================
// DOM REFS
// ========================================
const galleryGrid  = document.getElementById('galleryGrid');
const overlay      = document.getElementById('imageOverlay');
const overlayImage = document.getElementById('overlayImage');
const closeBtn     = document.querySelector('.close-btn');
const prevBtn      = document.querySelector('.prev-btn');
const nextBtn      = document.querySelector('.next-btn');
const filterBtns   = document.querySelectorAll('.filter-btn');


// ========================================
// RENDER GALLERY
// ========================================
function renderGallery() {
    const fragment = document.createDocumentFragment();

    galleryItems.forEach((item) => {
        const div = document.createElement('div');
        div.className      = 'gallery-item';
        div.dataset.filter = item.filter;
        div.dataset.id     = item.id;

        div.innerHTML = `
            <div class="image-wrapper">
                <img src="${item.thumb}" alt="${item.alt}" loading="lazy">
            </div>
            <div class="btn-overlay">
                <button class="view-btn">View</button>
            </div>
        `;

        div.querySelector('.image-wrapper').addEventListener('click', () => openOverlay(item.id));
        div.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openOverlay(item.id);
        });

        fragment.appendChild(div);
    });

    galleryGrid.appendChild(fragment);
}


// ========================================
// FILTER
// ========================================
function filterGallery(filter) {
    state.activeFilter  = filter;
    state.filteredItems = filter === 'all'
        ? [...galleryItems]
        : galleryItems.filter(item => item.filter === filter);

    document.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.filter === filter) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterGallery(this.dataset.filter);
    });
});


// ========================================
// LIGHTBOX
// ========================================
function openOverlay(imageId) {
    const index = state.filteredItems.findIndex(item => item.id === imageId);
    if (index === -1) return;

    state.currentImageIndex = index;
    const item = state.filteredItems[index];

    overlayImage.src = item.full;
    overlayImage.alt = item.alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    preloadAdjacent();
}

function closeOverlay() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    state.currentImageIndex = null;
}

function navigate(direction) {
    if (state.currentImageIndex === null || state.isTransitioning) return;
    state.isTransitioning = true;
    overlayImage.classList.add('transitioning');

    setTimeout(() => {
        const total = state.filteredItems.length;
        state.currentImageIndex = direction === 'next'
            ? (state.currentImageIndex + 1) % total
            : (state.currentImageIndex - 1 + total) % total;

        const item = state.filteredItems[state.currentImageIndex];
        overlayImage.src = item.full;
        overlayImage.alt = item.alt;
        overlayImage.classList.remove('transitioning');
        state.isTransitioning = false;
        preloadAdjacent();
    }, 200);
}

function preloadAdjacent() {
    if (state.currentImageIndex === null) return;
    const total = state.filteredItems.length;
    [
        (state.currentImageIndex + 1) % total,
        (state.currentImageIndex - 1 + total) % total,
    ].forEach(i => { new Image().src = state.filteredItems[i].full; });
}

closeBtn.addEventListener('click', closeOverlay);
prevBtn.addEventListener('click',  e => { e.stopPropagation(); navigate('prev'); });
nextBtn.addEventListener('click',  e => { e.stopPropagation(); navigate('next'); });
overlay.addEventListener('click',  e => { if (e.target === overlay) closeOverlay(); });
document.querySelector('.overlay-inner').addEventListener('click', e => e.stopPropagation());

document.addEventListener('keydown', e => {
    if (state.currentImageIndex === null) return;
    if (e.key === 'Escape')     closeOverlay();
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft')  navigate('prev');
});


// ========================================
// INIT
// ========================================
renderGallery();