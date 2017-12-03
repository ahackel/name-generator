'use strict';

class NameGenApp {

	constructor () {
		this.favorites = JSON.parse(localStorage['favorites'] || '[]');
		this.inMethod = $('#inMethod');
		this.inName = $('#inName');
		this.inNumParts = $('#inNumParts');
	
		for (name in this.favorites) {
			this.addItem(this.favorites[name], true);
		}

		$('#btnGenerate').click(function(){
			var name;
			switch (this.inMethod.val()) {
				case "similar":
					var orgName = this.inName.val();
					if (orgName)
						name = nameGen.generateSimilarName(orgName, parseInt(this.inNumParts.val()));
					else
						name = nameGen.generateName("", parseInt(this.inNumParts.val()));
				break;
				case "startsWith":
					name = nameGen.generateName(this.inName.val(), parseInt(this.inNumParts.val()));
				break;
				case "endsWith":
					name = nameGen.generateNameReverse(this.inName.val(), parseInt(this.inNumParts.val()));
				break;
			}
			if (name.length > 0)
				this.addItem(name, false);
		}.bind(this));
	}

	addItem(name, favorite) {
		var item = $('<p data-name="' + name + '">' + name + '</p>');

		/*var selectBtn = $('<div class="select">↑</div>');
		selectBtn.click(function(e){
			this.inName.val(e.target.parentElement.dataset.name);
		}.bind(this));
		item.append(selectBtn);*/

		var favoriteBtn = $('<div class="favoriteBtn">★</div>');
		favoriteBtn.click(function(e){
			$(e.target.parentElement).toggleClass('favorite');

			if ($(e.target.parentElement).hasClass('favorite'))
				this.favorites.push(e.target.parentElement.dataset.name)
			else {
				this.favorites.splice(this.favorites.indexOf(e.target.parentElement.dataset.name), 1);
			}
			localStorage['favorites'] = JSON.stringify(this.favorites);
		}.bind(this));
		item.prepend(favoriteBtn);

		item.click(function(e){
			this.inMethod.val("similar");
			this.inName.val(e.target.dataset.name);
		}.bind(this));

		item.toggleClass('favorite', favorite);
		$('#names').prepend(item);
	}

}


$( document ).ready(function() {
	var nameGenApp = new NameGenApp();
});