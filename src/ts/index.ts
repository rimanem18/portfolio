'use strict';
const { intersectAction } = require('./libs/intersectAction');
const Swiper = require('./libs/swiper.min.js');

const d = document;

const swiper = new Swiper('.swiper-container', {
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });


const animClass = [
	'.clip-inset',
	'.overlap-panels__bg-blue',
	'.overlap-panels__img',
	'.overlap-panels__contents',
	'.overlap-panels__bg-blue--second',
	'.overlap-panels__img--second',
	'.overlap-panels__contents--second'
]
animClass.forEach(anim => {
	let elements = d.querySelectorAll(anim);
	intersectAction(elements, (element, isIntersectiong, observer) => {
		if (isIntersectiong) {
			element.classList.add('fadeOn');
			observer.unobserve(element);
		}
	}, null);
});


