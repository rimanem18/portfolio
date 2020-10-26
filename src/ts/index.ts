'use strict';
const {intersectAction} = require('./libs/intersectAction');


const d = document;

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
	},null);
});
