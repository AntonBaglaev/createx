import './_vendor';
import vars from './_vars';
import './_functions';
import './_components';
import './_components';

const bodyStyles = window.getComputedStyle(document.body);
const gap = parseInt(bodyStyles.getPropertyValue('--grid-gap')); 

const portSlider = document.querySelector('.portfolio-section__items');
const relatedSlider = document.querySelector('.related-projects__items');

import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);


if (portSlider) {
  const portfolioSlider = new Swiper(portSlider, {
    slidesPerView: 3,
    spaceBetween: gap,
    //loop: true,
    on: {
      init: function () {
    
        const activeSlide = portSlider.querySelector('.swiper-slide-active');
        const nextActiveSlide = activeSlide.nextElementSibling;
        const nextNextActiveSlide = nextActiveSlide.nextElementSibling;

        activeSlide.classList.add('slider-visible');
        nextActiveSlide.classList.add('slider-visible');
        nextNextActiveSlide.classList.add('slider-visible');
        
      },
    },
    navigation: {
      nextEl: '.portfolio-section__next',
      prevEl: '.portfolio-section__prev',
    },
  });

document.querySelector('.portfolio-section__prev').addEventListener('click', () => {
  const activeSlide = portSlider.querySelector('.swiper-slide-next');

  document.querySelectorAll('.portfolio-section__items .swiper-slide').forEach(el => {
    el.classList.remove('slider-visible');
  });

  if (activeSlide.previousElementSibling) {
    const nextActiveSlide = activeSlide.previousElementSibling;
    activeSlide.classList.add('slider-visible');
    nextActiveSlide.classList.add('slider-visible');
    activeSlide.nextElementSibling.classList.add('slider-visible');
  } 
})

document.querySelector('.portfolio-section__next').addEventListener('click', () => {
  const activeSlide = portSlider.querySelector('.swiper-slide-active');
  const nextActiveSlide = activeSlide.nextElementSibling;
  const nextNextActiveSlide = nextActiveSlide.nextElementSibling;

  document.querySelectorAll('.portfolio-section__items .swiper-slide').forEach(el => {
    el.classList.remove('slider-visible');
  });

  activeSlide.classList.add('slider-visible');
  nextActiveSlide.classList.add('slider-visible');
  nextNextActiveSlide.classList.add('slider-visible');
})  
}

if (relatedSlider) {
  const relatedProjSlider = new Swiper(relatedSlider, {
    slidesPerView: 3,
    spaceBetween: gap,
    //loop: true,
    on: {
      init: function () {
    
        const activeSlide = relatedSlider.querySelector('.swiper-slide-active');
        const nextActiveSlide = activeSlide.nextElementSibling;
        const nextNextActiveSlide = nextActiveSlide.nextElementSibling;

        activeSlide.classList.add('slider-visible');
        nextActiveSlide.classList.add('slider-visible');
        nextNextActiveSlide.classList.add('slider-visible');
        
      },
    },
    navigation: {
      nextEl: '.related-projects__next',
      prevEl: '.related-projects__prev',
    },
  });

document.querySelector('.related-projects__prev').addEventListener('click', () => {
  const activeSlide = relatedSlider.querySelector('.swiper-slide-next');

  document.querySelectorAll('.related-projects__items .swiper-slide').forEach(el => {
    el.classList.remove('slider-visible');
  });

  if (activeSlide.previousElementSibling) {
    const nextActiveSlide = activeSlide.previousElementSibling;
    activeSlide.classList.add('slider-visible');
    nextActiveSlide.classList.add('slider-visible');
    activeSlide.nextElementSibling.classList.add('slider-visible');
  } 
})

document.querySelector('.related-projects__next').addEventListener('click', () => {
  const activeSlide = relatedSlider.querySelector('.swiper-slide-active');
  const nextActiveSlide = activeSlide.nextElementSibling;
  const nextNextActiveSlide = nextActiveSlide.nextElementSibling;

  document.querySelectorAll('.related-projects__items .swiper-slide').forEach(el => {
    el.classList.remove('slider-visible');
  });

  activeSlide.classList.add('slider-visible');
  nextActiveSlide.classList.add('slider-visible');
  nextNextActiveSlide.classList.add('slider-visible');
})  
}


/* slider testimonials */
const testimonialsSlider = new Swiper('.testimonials__items', {
  slidesPerView: 1,
  spaceBetween: gap,
  loop: true,
  navigation: {
    nextEl: '.testimonials__next',
    prevEl: '.testimonials__prev',
  },
});
/* slider testimonials end */

/*progressAnimation*/ 
// const circle = document.querySelector('.progress');

// const progressAnimation = () => {
//     let percentageProgress = Math.floor(70);
  
//     let radius = circle.getAttribute('r');
//     let circleLength = 2 * Math.PI * radius;
//     circle.setAttribute('stroke-dasharray', circleLength);
//     circle.setAttribute('stroke-dashoffset', circleLength - circleLength * percentageProgress / 100);
// };

// progressAnimation();

const circles = document.querySelectorAll('.facts-element__circle');
circles.forEach(el => {

  if (el.dataset.percentage == 'true') {
    let progress = el.querySelector('.progress');
    let valueBlock = el.querySelector('.facts-element__value');
    let radius = progress.getAttribute('r');
    let circleLength = 2 * Math.PI * radius;
    let full = el.dataset.full;
    let value = el.dataset.value;
    let percentageProgress = Math.floor(value / full * 100);
    valueBlock.textContent = value;
    progress.setAttribute('stroke-dasharray', circleLength);
    progress.setAttribute('stroke-dashoffset', circleLength - circleLength * percentageProgress / 100);
  } else {
    let progress = el.querySelector('.progress');
    let valueBlock = el.querySelector('.facts-element__value');
    let radius = progress.getAttribute('r');
    let circleLength = 2 * Math.PI * radius;
    let percent = el.dataset.percent;
    let percentageProgress = Math.floor(percent);
    valueBlock.textContent = percent + '%';
    progress.setAttribute('stroke-dasharray', circleLength);
    progress.setAttribute('stroke-dashoffset', circleLength - circleLength * percentageProgress / 100);
  }
});
/*progressAnimation end*/ 

/*accordion*/
class GraphAccordion {
	constructor(selector, options) {
		let defaultOptions = {
			isOpen: () => {},
			isClose: () => {},
			speed: 300
		};

		this.options = Object.assign(defaultOptions, options);
		this.accordion = document.querySelector(selector);
		this.control = this.accordion.querySelector('.accordion__control');
		this.content = this.accordion.querySelector('.accordion__content');
		this.event();
    this.start();
	}

  start() {
    if (this.accordion) {
      if (this.accordion.classList.contains('is-open')){
        this.open();
      }
    }
  }

	event() {
		console.log('event!');
		
		if (this.accordion) {
			this.accordion.addEventListener('click', (e) => {
				this.accordion.classList.toggle('open');

				if (this.accordion.classList.contains('open')) {
					this.open();
				} else {
					this.close();
				}
			});
		}
	}

	open() {
		this.accordion.style.setProperty('--accordion-time', `${this.options.speed / 1000}s`);
		this.accordion.classList.add('is-open');
		this.control.setAttribute('aria-expanded', true);
		this.content.setAttribute('aria-hidden', false);
		this.content.style.maxHeight = this.content.scrollHeight + 'px';
		this.options.isOpen(this);
	}

	close() {
		this.accordion.classList.remove('is-open');
		this.control.setAttribute('aria-expanded', false);
		this.content.setAttribute('aria-hidden', true);
		this.content.style.maxHeight = null;
		this.options.isClose(this);
	}
}

if (document.querySelector('.we-offer')) {
  const accordion1 = new GraphAccordion('.accordion-1', {
    speed: 300,
  });
  
  const accordion2 = new GraphAccordion('.accordion-2', {
    speed: 300,
  });
}

/*accordion end*/

/* portfolio-tabs */

const portfolioTabsNav = document.querySelector('.portfolio-tabs-nav');

portfolioTabsNav.addEventListener('click', (e) => {
  const target = e.target;
  if (target.classList.contains('portfolio-tabs-nav__btn')) {
    console.log('asd');

    const path = target.dataset.path;

    document.querySelectorAll('.portfolio-tabs__item').forEach(el => { el.style.display = 'none' });

    document.querySelectorAll('[data-target="${path}"]').forEach(el => { 
      el.closest('.portfolio-tabs__item').classList.add('portfolio-tabs__item--visible');
    });
  }
});

/* portfolio-tabs end */