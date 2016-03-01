google.load("feeds", "1");
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
var app = function() {
	var getMovies = {
		movies: [],
		init: function() {
			var feed = new google.feeds.Feed("http://rss.imdb.com/user/ur49535208/watchlist");
			feed.setNumEntries(1000);
			feed.load(function(result) {
				if (!result.error) {
					for (var i = 0; i < result.feed.entries.length; i++) {
						var entry = result.feed.entries[i];

						var imdbID = entry.link.split( '/' )[4];
						var moviePosterURL = 'http://img.omdbapi.com/?i='+ imdbID +'&apikey=d8995e02';

						var movie = document.createElement("article");
						movie.classList.add('movie');
						movie.dataset.title = entry.title;

						var image = document.createElement("img");
						image.classList.add("moviePoster");
						image.dataset.echo = moviePosterURL;
						image.src = 'assets/images/loader.gif';

						movie.appendChild(image);

						getMovies.movies.push(movie);
					}
					getMovies.showMovies();
				}
			});
		},
		showMovies: function() {
			var container = document.getElementById("movies");
			this.movies.forEach(function(element) {
				container.appendChild(element);
			});

			this.lazyLoad();
			searchForm.init();
		},
		lazyLoad: function() {
			echo.init({
				offset: 100,
				throttle:0,
				unload: false,
				callback: function (element, op) {
					element.parentElement.classList.add('loaded');
				}
			});
		}
	};

	var searchForm = {
		init: function() {
			window.onkeyup = this.keyup;
			this.windowHeight = window.innerHeight;
			this.watch();
		},
		watch: function() {
			var searchForm = document.getElementById('searchInput');
			searchForm.addEventListener('onkeydown', function() {
				console.log('a');
			});
		},
		keyup: function(e) {
			var searchInput = document.getElementById('searchInput');
			this.term = searchInput.value;

			console.log(this.term);

			if(e.keyCode == 13) {
				e.preventDefault();
				return false;
			}

			searchForm.filter(this.term);
		},
		filter: function(term) {
			var elems = document.getElementsByClassName('movie');
			for (var i = 0; i < elems.length; ++i){
				var thisEl = elems[i];
				var thisTitle = thisEl.dataset.title.toLowerCase();

				if (thisTitle.contains(term.toLowerCase())) {
					thisEl.classList.remove('hidden');
					var image = thisEl.getElementsByClassName("moviePoster")[0];
					if (this.windowHeight > thisEl.offsetTop && image.dataset.echo) {
						image.src = image.dataset.echo;
						console.log(image.dataset.echo);
					}
				} else {
					thisEl.classList.add('hidden');
				}
			}
		}
	};

	google.setOnLoadCallback(getMovies.init);
};
app();
