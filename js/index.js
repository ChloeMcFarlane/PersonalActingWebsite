

// SCROLL REVEAL FOR ABOUT IMAGE
const aboutImg = document.querySelector('img');

const revealOnScroll = () => {
  const images = document.querySelectorAll('img:not(.her-img)');
  images.forEach((img) => {
    const elementTop = img.getBoundingClientRect().top;
    const elementBottom = img.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    // Reveal when element enters viewport
    if (elementTop < windowHeight * 0.85 && elementBottom > 0) {
      img.classList.add('revealed');
    } 
    // Hide when element leaves viewport
    else {
      img.classList.remove('revealed');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// TESTIMONIAL CAROUSEL 
const testimonials = [
    {
      quote: "Chloe is an exceptional talent with a captivating presence.",
      company: "[Insert Company Name]"
    },
    {
      quote: "Outstanding performance and professionalism every single time.",
      company: "[Insert Company Name]"
    },
    {
      quote: "A true artist who brings magic to every project she touches.",
      company: "[Insert Company Name]"
    },
    {
      quote: "Working with Chloe elevated our entire production quality.",
      company: "[Insert Company Name]"
    }
  ];

  let currentIndex = 0;
  let isTransitioning = false;

  const quoteEl = document.getElementById('quote');
  const companyEl = document.getElementById('company');
  const starsEl = document.querySelector('.star-frame');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  function updateTestimonial(newIndex) {
    if (isTransitioning) return;
    isTransitioning = true;

    quoteEl.classList.add('fade-out');
    companyEl.classList.add('fade-out');
    starsEl.classList.add('fade-out');

    setTimeout(() => {
      currentIndex = newIndex;
      quoteEl.textContent = testimonials[currentIndex].quote;
      companyEl.textContent = testimonials[currentIndex].company;
      
      quoteEl.classList.remove('fade-out');
      companyEl.classList.remove('fade-out');
      starsEl.classList.remove('fade-out');
      
      setTimeout(() => {
        isTransitioning = false;
      }, 50);
    }, 400);
  }

  function goToPrev() {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    updateTestimonial(newIndex);
  }

  function goToNext() {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    updateTestimonial(newIndex);
  }

  prevBtn.addEventListener('click', goToPrev);
  nextBtn.addEventListener('click', goToNext);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  });

  // Initialize
  quoteEl.textContent = testimonials[0].quote;
  companyEl.textContent = testimonials[0].company;