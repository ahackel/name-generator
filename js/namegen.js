'use strict';

export class NameGen {

	constructor (partsFile) {
		this.MAX_COUNT = 50000;
		this.MIN_LENGTH = 4;
		this.MIN_PARTS = 1;
		this.MIN_SIMILARITY = 0.6;

		this.parts = [];
		this.names = [];

		this.loadParts(partsFile);
	}

	loadParts(partsFile) {
		function longer(s1, s2){
			return s2.length - s1.length;
		}

		fetch(partsFile)
			.then(response => {
				if (response.ok) {
					return Promise.resolve(response);
				}
				else {
					return Promise.reject(new Error('Failed to load ' + partsFile))
				}
			})
			.then(response => response.text())
			.then(data => {
				var lines = data.split(/\n/);

				for (var line of lines) {
					var parts = line.split(' ');

					for (var c = 0; c < parts.length; c++)
						this.addUnique(this.parts, parts[c].toLowerCase());
				}

				this.parts.sort(longer);
			})
			.catch(function(error) {
				console.log(`Error: ${error.message}`);
			});
	}

	addUnique(a, item) {
		if (a.includes(item) == false)
			a.push(item);
	}

	randomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	randomItem (_array) {
		return _array[this.randomInt(0, _array.length)];
	}

	getRandomPart(start) {
		var parts = nameGen.parts;
		var validParts = parts;

		if (start && start.length > 0)
			validParts = parts.filter(function(s){ return s.startsWith(start.substr(0, s.length)); });

		if (validParts.length > 0) {
			return this.randomItem(validParts);
		}
		else
			return '';
	}

	getRandomPartReverse(end) {
		var parts = nameGen.parts;
		var validParts = parts;

		if (end && end.length > 0) {
			validParts = parts.filter(function(s){ return s.endsWith(end.substr(-s.length)); });
		}

		if (validParts.length > 0) {
			return this.randomItem(validParts);
		}
		else
			return '';
	}

	generateName(start, maxParts) {

		start = start || "";
		maxParts = maxParts || 3;

		start = start.toLowerCase();

		var name = "";
		var count = 0;

		do {
			name = "";
			count++;

			var numParts = this.randomInt(this.MIN_PARTS, maxParts + 1);
			var _start = start;

			for (var i = 0; i < numParts; i++) {
				var part = this.getRandomPart(_start);
				_start = _start.substr(part.length);
				name += part;
				if (name.length == 0) continue;
			}

		} while ((name.length < this.MIN_LENGTH || this.names.includes(name)) && count < this.MAX_COUNT)

		if (count == this.MAX_COUNT)
			name = "";

		if (name.length > 0) {
			this.names.push(name);
			name = name[0].toUpperCase() + name.slice(1);
		}

		return name;
	}

	generateNameReverse(end, maxParts) {

		end = end || "";
		maxParts = maxParts || 3;

		end = end.toLowerCase();

		var name = "";
		var count = 0;

		do {
			name = "";
			count++;

			var numParts = this.randomInt(this.MIN_PARTS, maxParts + 1);
			var _end = end;

			for (var i = 0; i < numParts; i++) {
				var part = this.getRandomPartReverse(_end);
				_end = _end.substr(0, _end.length - part.length);
				name = part + name;
				if (name.length == 0) continue;
			}

		} while ((name.length < this.MIN_LENGTH || this.names.includes(name)) && count < this.MAX_COUNT)

		if (count == this.MAX_COUNT)
			name = "";

		if (name.length > 0) {
			this.names.push(name);
			name = name[0].toUpperCase() + name.slice(1);
		}

		return name;
	}

	generateSimilarName(orgName, maxParts) {

		if (!orgName) {
			return this.generateName('', maxParts);
		}

		maxParts = maxParts || 3;

		orgName = orgName.toLowerCase();

		var name = "";
		var count = 0;

		do {
			name = "";
			count++;

			var numParts = this.randomInt(this.MIN_PARTS, maxParts + 1);

			for (var i = 0; i < numParts; i++) {
				var part = this.getRandomPart();
				name += part;
				if (name.length == 0) continue;
			}

		} while ((name.length < this.MIN_LENGTH || name == orgName || this.names.includes(name) ||
			this.similarName(orgName, name) < this.MIN_SIMILARITY) && count < this.MAX_COUNT)

		if (count == this.MAX_COUNT)
			name = "";

		if (name.length > 0) {
			this.names.push(name);
			name = name[0].toUpperCase() + name.slice(1);
		}

		return name;
	}

	breakName(name) {
		name = name.toLowerCase();

		function isVowel(s) {
			return (/^[aeiouäüöy]$/i).test(s);
		}

		var broken = "";
		var len = name.length;
		var lastVowelPos = -1;
		var lastSplitPos = 0;

		for (var i = 0; i < len; i++) {
			if (isVowel(name[i])) {
				if (lastVowelPos > -1) {
					if (lastVowelPos + 1 == i) {
						var part = name[i - 1] + name[i];
						if (part == "au" || part == "äu" || part == "eu" || part == "ei" || part == "ie" || part == "ou" || part == "ai")
							continue;
					}


					var newSplitPos = i;
					if (lastVowelPos + 1 < i) {
						var lastPart = name.substr(i - 4, 4);
						if (lastPart == "schr" || lastPart == "schr")
							newSplitPos -= 4;
						else {
							var lastPart = name.substr(i - 3, 3);
							if (lastPart == "sch")
								newSplitPos -= 3;
							else {
								lastPart = name.substr(i - 2, 2);
								if (lastPart == "ch" || lastPart == "ck" || lastPart == "br" || lastPart == "dr" || lastPart == "tr" || lastPart == "sp" || lastPart == "st" || lastPart == "th" || lastPart == "ph" || lastPart == "pf")
									newSplitPos -= 2;
								else
									newSplitPos -= 1;
							}
						}
					}
					var part = name.substr(lastSplitPos, newSplitPos - lastSplitPos);
					if (broken.length > 0)
						broken += "-";
					broken += part;
					lastSplitPos = newSplitPos;
				}
				lastVowelPos = i;
			}
		}

		var part = name.substr(lastSplitPos);
		if (broken.length > 0)
			broken += "-";
		broken += part;

		return broken;
	}


	similarName(s1, s2) {

		function editDistance(s1, s2) {
			s1 = s1.toLowerCase();
			s2 = s2.toLowerCase();

			var costs = new Array();
			for (var i = 0; i <= s1.length; i++) {
				var lastValue = i;
				for (var j = 0; j <= s2.length; j++) {
					if (i == 0)
						costs[j] = j;
					else {
						if (j > 0) {
							var newValue = costs[j - 1];
							if (s1.charAt(i - 1) != s2.charAt(j - 1))
								newValue = Math.min(Math.min(newValue, lastValue),
									costs[j]) + 1;
							costs[j - 1] = lastValue;
							lastValue = newValue;
						}
					}
				}
				if (i > 0)
					costs[s2.length] = lastValue;
			}
			return costs[s2.length];
		}

		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength == 0) {
			return 1.0;
		}
		return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
	}
}
