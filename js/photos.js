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
// Filenames must match the files in /src EXACTLY, including capitalisation
// and extension (.JPG vs .jpg vs .jpeg) — many web hosts are case-sensitive.
// filter: 'one' = Theatre, 'two' = Digitals, 'three' = Headshots
// Order here = order on the page. To add a photo, copy a row and change the filename.
// ========================================
const galleryItems = [
    // THEATRE
    { id: 1 , thumb: '../src/RJprodphoto2.jpg', full: '../src/RJprodphoto2.jpg', filter: 'one', alt: 'Theatre' },
    { id: 2 , thumb: '../src/LWprodphotos2.jpg', full: '../src/LWprodphotos2.jpg', filter: 'one', alt: 'Theatre' },
    { id: 3 , thumb: '../src/LWprodphotos3.jpg', full: '../src/LWprodphotos3.jpg', filter: 'one', alt: 'Theatre' },
    { id: 4 , thumb: '../src/LWprodphotos1.jpg', full: '../src/LWprodphotos1.jpg', filter: 'one', alt: 'Theatre' },
    { id: 5 , thumb: '../src/TGprodphoto1.jpg', full: '../src/TGprodphoto1.jpg', filter: 'one', alt: 'Theatre' },
    { id: 6 , thumb: '../src/CMProductionPhotoLB.jpg', full: '../src/CMProductionPhotoLB.jpg', filter: 'one', alt: 'Theatre' },
    // HEADSHOTS
    { id: 7 , thumb: '../src/Headshot1.jpg', full: '../src/Headshot1.jpg', filter: 'three', alt: 'Headshots' },
    { id: 8 , thumb: '../src/Headshot2.jpg', full: '../src/Headshot2.jpg', filter: 'three', alt: 'Headshots' },
    { id: 9 , thumb: '../src/Headshot3.jpg', full: '../src/Headshot3.jpg', filter: 'three', alt: 'Headshots' },
    { id: 10, thumb: '../src/Headshot4.jpg', full: '../src/Headshot4.jpg', filter: 'three', alt: 'Headshots' },
    { id: 11, thumb: '../src/Headshot5.jpg', full: '../src/Headshot5.jpg', filter: 'three', alt: 'Headshots' },
    { id: 12, thumb: '../src/Headshot7.jpg', full: '../src/Headshot7.jpg', filter: 'three', alt: 'Headshots' },
    // DIGITALS
    { id: 13, thumb: '../src/CMdigital1.JPG', full: '../src/CMdigital1.JPG', filter: 'two', alt: 'Digitals' },
    { id: 14, thumb: '../src/CMdigital2.JPG', full: '../src/CMdigital2.JPG', filter: 'two', alt: 'Digitals' },
    { id: 15, thumb: '../src/CMdigital3.jpeg', full: '../src/CMdigital3.jpeg', filter: 'two', alt: 'Digitals' },
    { id: 16, thumb: '../src/CMdigital4.jpeg', full: '../src/CMdigital4.jpeg', filter: 'two', alt: 'Digitals' },
    { id: 17, thumb: '../src/CMdigital5.jpeg', full: '../src/CMdigital5.jpeg', filter: 'two', alt: 'Digitals' },
    { id: 18, thumb: '../src/CMdigital6.jpeg', full: '../src/CMdigital6.jpeg', filter: 'two', alt: 'Digitals' },
    { id: 19, thumb: '../src/CMdigital7.jpeg', full: '../src/CMdigital7.jpeg', filter: 'two', alt: 'Digitals' },
    { id: 20, thumb: '../src/CMdigital8.jpeg', full: '../src/CMdigital8.jpeg', filter: 'two', alt: 'Digitals' },
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