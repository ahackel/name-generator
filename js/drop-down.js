'use strict';

class DropDown extends HTMLElement {
	constructor(){
		super();
		const shadow = this.attachShadow({ mode: 'open' });
		const select = document.createElement('select');


		for (let i = 0; i < 10; i++) {
			const option = document.createElement('option');
			option.text = i;
			select.appendChild(option);
		}

		shadow.appendChild(select);
	}

	static get observedAttributes() {
		return ['options'];
	}

	get options() {
		return this.getAttribute('options');
	}

	set options(val) {
		this.setAttribute('options', val)
	}

	connectedCallback() {
		//console.log(options);
		//this.innerHTML = this.getAttribute("term");
	}

	updateOptions() {
		let options = this.getAttribute('options');

	}
}
window.customElements.define('drop-down', DropDown);
