
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