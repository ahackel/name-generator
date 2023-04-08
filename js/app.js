'use strict';

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import {NameGen} from "./namegen.js";


// localStorage persistence
var STORAGE_KEY = 'name-generator'
var nameStorage = {
	fetch: function () {
		var nameArray = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
		return nameArray.map(n => ({ name: n, favorite: true }))
	},
	save: function (names) {
		var nameArray = names.filter(n => n.favorite).map(n => n.name);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nameArray))
	}
}

var nameGen = new NameGen('data/parts.txt');

const app = createApp({
	el: '#app',

	data() {
		return {
			templateName: "",
			methodOptions: {
				options: ["Similar", "Starts With", "Ends With"],
				selectedIndex: 0
			},
			partsOptions: {
				options: ["1 Syllable", "2 Syllables", "3 Syllables", "4 Syllables", "5 Syllables"],
				selectedIndex: 2
			},
			names: nameStorage.fetch()
		}
	},
	methods: {
		generateName() {
			var numParts = this.partsOptions.selectedIndex + 1;
			var name = '';
			var method = this.methodOptions.selectedIndex;

			const SIMILAR = 0;
			const STARTS_WITH = 1;
			const ENDS_WITH = 2;

			switch (method) {
				case SIMILAR:
					name = nameGen.generateSimilarName(this.templateName, numParts);
					break;
				case STARTS_WITH:
					name = nameGen.generateName(this.templateName, numParts);
					break;
				case ENDS_WITH:
					name = nameGen.generateNameReverse(this.templateName, numParts);
					break;
			}

			this.names.push({ name: name, favorite: false });
		},
		setTemplate(entry) {
			this.templateName = entry.name;
		}
	},
	watch: {
		names: {
			handler(names) {
				nameStorage.save(names);
			},
			deep: true
		}
	}
});

app.component('drop-down', {
	props: ['options', 'selectedIndex'],
	template: `<span class="plain-select">
    <select @input="$emit('update:selectedIndex', $event.target.selectedIndex)">
      <option v-for="(option, index) in options" :selected="index == selectedIndex ? 'selected' : ''">{{ option }}</option>
    </select>
  </span>`
});

app.component('name-entry', {
	props: ['name', 'favorite'],
	template: `<li>
    <a href="#" :class="(favorite) ? 'favorite' : 'no-favorite'" @click="$emit('update:favorite', !favorite)">★</a>
    <a href="#" @click="nameClicked">{{ name }}</a>
  </li>`,
	methods: {
		nameClicked: function() {
			this.$emit('name-clicked', this)
		}
	}
});

app.mount('#app');
