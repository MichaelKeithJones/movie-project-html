(() => {
    "use strict";

    //--------------------------------//
    // Constant Variables
    //--------------------------------//

    const genre = {
        '28':       'action',
        '12':       'adventure',
        '16':       'animation',
        '35':       'comedy',
        '80':       'crime',
        '99':       'documentary',
        '18':       'drama',
        '10751':    'family',
        '14':       'fantasy',
        '36':       'history',
        '27':       'horror',
        '10402':    'music',
        '9648':     'mystery',
        '10749':    'romance',
        '878':      'sci-fi',
        '10770':    'tv-movie',
        '53':       'thriller',
        '10752':    'war',
        '37':       'western'
    }
    const languages = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'ru': 'Russian',
        'th': 'Thai',
        'de': 'German',
        'zh': 'Chineses',
        'ja': 'Japanese',
        'it': 'Italian'
    }

    //--------------------------------//
    // Global Functions
    //--------------------------------//
    let capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
    let convertTMDBGenreIDS = ids => ids.map(genreID => capitalizeFirstLetter(genre[genreID])).join(', ');
    let convertTMDBLanguage = code => languages[code] ? languages[code] : code;
    let convertTMDBDate = date => date.split('-')[0];

    //--| Horror Movie URL|---------------------//
    const horrorTMDBURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&sort_by=popularity.desc&language=en-US&page=1`;
    //--| Action Movie URL|---------------------//
    const actionTMDBURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&sort_by=popularity.desc&language=en-US&page=1`;
    //--| Documentary Movie URL|---------------------//
    const documentaryTMDBURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&sort_by=popularity.desc&language=en-US&page=1`;
    //--| Animation Movie URL|---------------------//
    const animationTMDBURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=popularity.desc&language=en-US&page=1`;
    //--| Drama Movie URL|---------------------//
    const dramaTMDBURL = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=18&sort_by=popularity.desc&language=en-US&page=1`;

    //--| Promise: Movie Genres|---------------------//
    const promiseHorrorMovies = fetch(horrorTMDBURL);
    const promiseActionMovies = fetch(actionTMDBURL);
    const promiseDocumentaryMovies = fetch(documentaryTMDBURL);
    const promiseAnimationMovies = fetch(animationTMDBURL);
    const promiseDramaMovies = fetch(dramaTMDBURL);

    Promise.all([promiseHorrorMovies, promiseActionMovies, promiseDocumentaryMovies, promiseAnimationMovies,promiseDramaMovies])
        .then(data => {
            //--| Constant Variables |---------------------//
            const posterTMDBURL = `https://image.tmdb.org/t/p/original`;

            //--| Instance Variables |---------------------//
            let tempBrowselist = {}
            let promiseBrowselist = [];

            //--| Note: Build browse list from responses |---------------------//
            data.forEach(element => {
                promiseBrowselist = element.json().then(data => {
                    let tempArray = [];
                    let templist = {};
                    data.results.forEach((movie, index) => {
                        templist[`${index}`] = {
                            backdrop: posterTMDBURL + movie.backdrop_path,
                            genre: convertTMDBGenreIDS(movie.genre_ids),
                            id: index,
                            language: convertTMDBLanguage(movie.original_language),
                            overview: movie.overview,
                            poster: (posterTMDBURL + movie.poster_path) == 'https://image.tmdb.org/t/p/originalnull' ? `https://dummyimage.com/200x300/000/fff&text=No+Image+Found` : posterTMDBURL + movie.poster_path,
                            title: movie.title,
                            year: convertTMDBDate(movie.release_date),
                            tmdb: movie.id
                        };
                        tempArray.push(convertTMDBGenreIDS(movie.genre_ids));
                    })
                    //--| Note: Pulls most common genre/key value name from movie list |---------------------//
                    let result = {};
                    tempArray.join(', ').split(', ').sort().map(element => { result[element] = result[element] ? result[element] + 1 : 1; });
                    for (const key in result) { if (result[key] === 20) { tempBrowselist[key.toLowerCase()] = templist;  return tempBrowselist;} }
                }).catch(err => console.log(err));
            });

            //--| Promise: Watchlist |---------------------//
            const watchlistGlitchURL = `https://aluminum-purple-grouse.glitch.me/movies`;
            const promiseWatchlist = fetch(watchlistGlitchURL).then(response => response.json().then(data => data));

            Promise.all([promiseBrowselist, promiseWatchlist]).then(data => {

                //--------------------------------//
                // Constant Variables
                //--------------------------------//

                //--| Carousel |---------------------//
                const leftButtons = document.getElementsByClassName("left-button");
                const rightButtons = document.getElementsByClassName("right-button");
                const numOfPosters = 5;
                const carouselWidth = 1064;
                const posterMarginRight = 16;
                const posterCount = 20;
                const maxX = -((posterCount / numOfPosters) * carouselWidth + (posterMarginRight * (posterCount / numOfPosters)) - carouselWidth - posterMarginRight);
                //--| Add Modal |---------------------//
                const addModal = document.getElementById("add-modal");
                const addModalCloseButton = document.getElementsByClassName("close-button")[0];
                const addModalStarRating = document.querySelectorAll('#add-modal .stars input');
                const addModalAddButton = document.querySelector('#add-button');
                //--| Edit Modal |---------------------//
                const editModal = document.getElementById("edit-modal");
                const editModalCloseButton = document.getElementsByClassName("close-button")[1];
                const editModalStarRating = document.querySelectorAll('#edit-modal .stars input');
                const editModalDeleteButton = document.querySelector('#delete-button');
                const editModalWatchButton = document.querySelector('#watch-button');
                //--| Watchlist Modal |---------------------//
                const watchModal = document.getElementById("watch");
                //--| Browselist Modal |---------------------//
                const browseModal = document.getElementById("browse");
                //--| Searchlist Modal |---------------------//
                const searchModal = document.getElementById("search");
                //--| Menu Modal |---------------------//
                const menuModal = document.getElementById("menu");
                const watchButton = document.getElementById('filter-watched');
                const ratingDropdown = document.querySelectorAll('#filter-rating a');
                const genreDropdown = document.querySelectorAll('#filter-genre a');
                //--| Loader |---------------------//
                const loader = document.querySelector('#loader');

                //--------------------------------//
                // Instance Variables
                //--------------------------------//

                let browselist = data[0];
                let watchlist = data[1];

                let sortFlag;
                let watchedFilter;
                let ratingFilter;
                let genreFilter;

                //--------------------------------//
                // Instance Functions
                //--------------------------------//

                //--| Watchlist Logic |---------------//
                function resetWatchlist(){
                    document.querySelector('#sort-rating').checked = false;
                    document.querySelector('#sort-genre').checked = false;
                    document.querySelector('#sort-title').checked = false;
                    sortFlag = "";
                    watchedFilter = false;
                    document.querySelector('#filter-watched').checked = false;
                    ratingFilter = "";
                    genreFilter = "";
                }
                function filterAndSortWatchlist(e) {
                    let filterAndSortedList = watchlist.map(a => {return {...a}});
                    switch (sortFlag) {
                        case 'rating': filterAndSortedList.sort((a, b) => a.rating < b.rating); break;
                        case 'title': filterAndSortedList.sort((a, b) => a.title > b.title); break;
                        case 'genre': filterAndSortedList.sort((a, b) => a.genre > b.genre); break;
                        default: break;
                    }

                    if (watchedFilter) filterAndSortedList = filterAndSortedList.filter(element => element.watched === true);
                    if (ratingFilter !== "") filterAndSortedList = filterAndSortedList.filter(element =>  ratingFilter === "No Rating" || element.rating === ratingFilter.length);
                    if (genreFilter !== "") filterAndSortedList = filterAndSortedList.filter(element => genreFilter === "No Genre" || element.genre.includes(genreFilter));

                    showWatchlist(filterAndSortedList);
                }
                function processWatchlist() {
                    let temp = watchlist;
                    temp.forEach((element, index, array) => { array[index].actors = element.actors.split(', ').filter((element, index) => index < 4).join(', '); });
                    watchlist = temp;
                }
                function showWatchlist(list) {
                    watchModal.style.display = "none";
                    loader.style.display = "block";

                    processWatchlist();
                    document.querySelector('#watchlist .items').innerHTML = '';
                    list.forEach((element, index) => {
                        document.querySelector('#watchlist .items').innerHTML += `
                                        <div class="item" data-index="${index}" data-tmdb="${element.tmdb}">
                                            <img src=${element.poster}>
                                        </div>
                                    `;
                    })
                    const items = document.getElementsByClassName("item");
                    Array.from(items).forEach(element => element.addEventListener("click", showEditMovieModel));

                    watchModal.style.display = "block";
                    loader.style.display = "none";
                }
                //--| Carousel Logic |-----------------//
                function getCurrentTranslateXValue (element) {
                    var style = window.getComputedStyle(element);
                    var matrix = new WebKitCSSMatrix(style.transform);
                    return matrix.m41;
                }
                function moveCarouselLeft(e) {
                    e.target.removeEventListener('click', moveCarouselLeft);

                    let wrapper = e.target.parentElement.parentElement.firstElementChild;
                    const x = getCurrentTranslateXValue(wrapper);
                    const value = x + (carouselWidth + posterMarginRight);
                    if (x !== 0) wrapper.style.transform = `translateX(${value}px)`;

                    let startListening = () => { e.target.addEventListener("click", moveCarouselLeft); }
                    const myTimeout = setTimeout(startListening, 1000);
                }
                function moveCarouselRight(e) {
                    e.target.removeEventListener('click', moveCarouselRight);

                    let wrapper = e.target.parentElement.parentElement.firstElementChild;
                    const x = getCurrentTranslateXValue(wrapper);
                    const value = x - (carouselWidth + posterMarginRight);
                    if (x !== maxX) wrapper.style.transform = `translateX(${value}px)`;

                    let startListening = () => { e.target.addEventListener("click", moveCarouselRight); }
                    const myTimeout = setTimeout(startListening, 1000);
                }
                function showCarousel(carouselGenre) {
                    browseModal.style.display = "none";
                    loader.style.display = "block";

                    const galleryElement = document.getElementById(`gallery-${carouselGenre}`);
                    let tempMovielist = browselist[carouselGenre];
                    galleryElement.innerHTML = '';
                    for (const key in tempMovielist) {
                        galleryElement.innerHTML += `
                                        <div class="poster" data-id="${tempMovielist[key].id}" data-genre="${carouselGenre}">
                                            <img src=${tempMovielist[key].poster}>
                                        </div>
                                    `;
                    }
                    const posters = document.getElementsByClassName("poster");
                    Array.from(posters).forEach(element => element.addEventListener("click", showAddMovieModal));
                    browseModal.style.display = "block";
                    loader.style.display = "none";
                }
                //--| Search Logic |-----------------//
                function showSearchlist(title) {
                    searchModal.style.display = "none";
                    loader.style.display = "block";

                    const searchTMDBURL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title.toLowerCase().split(' ').join('+')}`
                    fetch(searchTMDBURL)
                        .then(response => response.json())
                        .then(data => {
                            const searchElement = document.querySelector("#searchlist .results");
                            if (data.results.length !== 0) {
                                let searchlist = {};
                                data.results.forEach((movie, index) => {
                                    searchlist[`${index}`] = {
                                        backdrop: posterTMDBURL + movie.backdrop_path,
                                        genre: convertTMDBGenreIDS(movie.genre_ids),
                                        id: index,
                                        language: convertTMDBLanguage(movie.original_language),
                                        overview: movie.overview,
                                        poster: (posterTMDBURL + movie.poster_path) == 'https://image.tmdb.org/t/p/originalnull' ? `https://dummyimage.com/200x300/000/fff&text=No+Image+Found` : posterTMDBURL + movie.poster_path,
                                        title: movie.title,
                                        year: convertTMDBDate(movie.release_date),
                                        tmdb: movie.id
                                    };
                                })
                                browselist['search'] = searchlist;
                                searchElement.innerHTML = "";
                                for (const key in searchlist) {
                                    searchElement.innerHTML += `
                                                    <div class="result" data-id="${searchlist[key].id}" data-genre="search">
                                                        <img src=${searchlist[key].poster}>
                                                    </div>
                                                `;
                                }
                                const results = document.getElementsByClassName("result");
                                Array.from(results).forEach(element => element.addEventListener("click", showAddMovieModal));
                            } else { searchElement.innerHTML = `<h2 style="color: white">No results</h2>`; }
                            searchModal.style.display = "block";
                            loader.style.display = "none";
                        })
                        .catch(err => console.log(err));
                }
                //--| Add Modal Logic |----------------//
                function showAddMovieModal(e){
                    const poster = e.target.parentElement;
                    const movie = browselist[poster.getAttribute('data-genre')][poster.getAttribute('data-id')];
                    let header = document.querySelector('#add-modal .header').style;
                    header.backgroundImage = "linear-gradient(to bottom, transparent, rgb(0, 0, 0)), url(" + movie.backdrop + ")";
                    header.backgroundRepeat = "no-repeat";
                    header.backgroundSize = 'contain';
                    document.querySelector('#add-modal .title').innerHTML           = movie.title;
                    document.querySelector('#add-modal .release-date').innerHTML    = movie.year;
                    document.querySelector('#add-modal .overview').innerHTML        = movie.overview;
                    document.querySelector('#add-modal .language').innerHTML        = movie.language;
                    document.querySelector('#add-modal .genres').innerHTML          = movie.genre;
                    document.querySelector('#add-modal').setAttribute('data-genre', poster.getAttribute('data-genre'));
                    document.querySelector('#add-modal').setAttribute('data-id', poster.getAttribute('data-id'));
                    addModalAddButton.checked = false;
                    addModal.style.display = "block";
                }
                function addModalResetStars() {
                    addModalStarRating.forEach(element => {
                        element.checked = false;
                        element.nextElementSibling.classList.remove("gold-star");
                        element.nextElementSibling.classList.add("add-star");
                    });
                }
                function addModalChangeStars(e) {
                    addModalResetStars();
                    let rating = e.target.value;
                    addModalStarRating.forEach(element => {
                        if (element.value <= rating) {
                            element.nextElementSibling.classList.remove("add-star");
                            element.nextElementSibling.classList.add("gold-star");
                            element.checked = true;
                        }
                    });
                }
                function closeAddMovieModal (){
                    addModalResetStars();
                    addModalStarRating.forEach(element => {
                        element.checked = false;
                    });
                    addModal.style.display = "none";
                }
                function addMovieToWatchlist(e) {
                    addModalAddButton.disabled = true;

                    const addModalElement = document.querySelector('#add-modal');
                    const movie = browselist[addModalElement.getAttribute('data-genre')][addModalElement.getAttribute('data-id')];

                    fetch(`https://api.themoviedb.org/3/movie/${movie.tmdb}?api_key=${TMDB_API_KEY}&append_to_response=credits`)
                        .then(response => response.json())
                        .then(data => {
                            const country = data.production_countries[0].name;
                            const runtime = `${data.runtime} min`;
                            const actors = data.credits.cast.map(member => member.name).join(', ');
                            let crew = {}
                            data.credits.crew.map(member => { crew[member.job] = crew[member.job] ? crew[member.job] + ', ' + member.name : member.name; });
                            const director = crew['Director'];
                            const writer = crew['Writer'];
                            let rating = 0;
                            addModalStarRating.forEach((element, index) => {
                                if (element.checked === true)
                                    rating = index + 1;
                            });

                            const value = (watchlist.length === 0) ? 1 : (watchlist[watchlist.length - 1].id + 1);
                            const movieObj = {
                                title: movie.title,
                                poster: movie.poster,
                                backdrop: movie.backdrop,
                                year: movie.year,
                                genre: movie.genre,
                                country,
                                language: movie.language,
                                actors: (actors !== undefined) ? actors : `N/A`,
                                director: (director !== undefined) ? director : `N/A`,
                                writer: (writer !== undefined) ? writer : `N/A`,
                                overview: movie.overview,
                                runtime,
                                rating,
                                watched: false,
                                tmdb: movie.tmdb,
                                id: value
                            };

                            watchlist.push(movieObj);
                            showWatchlist(watchlist);

                            fetch(watchlistGlitchURL, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json'},
                                body: JSON.stringify(movieObj)
                            }).then(response => {
                                console.log("POST: " + response.statusText);
                                let wait = () => {
                                    closeAddMovieModal();
                                    addModalAddButton.disabled = false;
                                };
                                const myTimeout = setTimeout(wait, 150);
                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                }
                //--| Edit Modal Logic |----------------//
                function showEditMovieModel(e) {
                    const tmdb = e.target.parentElement.getAttribute('data-tmdb');
                    let movie = watchlist.filter(e => e.tmdb == tmdb)[0];

                    document.querySelector('#edit-modal').setAttribute('data-tmdb', e.target.parentElement.getAttribute('data-tmdb'));
                    document.querySelector('#edit-modal img').setAttribute('src', movie.poster)
                    document.querySelector('#edit-modal .title').innerHTML      = `<span class="muted">Title: </span>${movie.title}`;
                    document.querySelector('#edit-modal .year').innerHTML       = `<span class="muted">Release Year: </span>${movie.year}`;
                    document.querySelector('#edit-modal .genre').innerHTML      = `<span class="muted">Genre: </span>${movie.genre}`;
                    document.querySelector('#edit-modal .country').innerHTML    = `<span class="muted">Country: </span>${movie.country}`;
                    document.querySelector('#edit-modal .language').innerHTML   = `<span class="muted">Language: </span>${movie.language}`;
                    document.querySelector('#edit-modal .actors').innerHTML     = `<span class="muted">Actor: </span>${movie.actors}`;
                    document.querySelector('#edit-modal .director').innerHTML   = `<span class="muted">Director: </span>${movie.director}`;
                    document.querySelector('#edit-modal .writer').innerHTML     = `<span class="muted">Writer: </span>${movie.writer}`;
                    document.querySelector('#edit-modal .overview').innerHTML   = `<span class="muted">Overview: </span>${movie.overview}`;
                    document.querySelector('#edit-modal .runtime').innerHTML    = `<span class="muted">Runtime: </span>${movie.runtime}`;

                    editModalStarRating.forEach(element => {
                        if (element.value <= movie.rating) {
                            element.nextElementSibling.classList.remove("edit-star");
                            element.nextElementSibling.classList.add("gold-star");
                            element.checked = true;
                        }
                    });

                    if (movie.watched === true) { editModalWatchButton.checked = true; }

                    editModal.style.display = "block";
                }
                function editModalResetStars() {
                    editModalStarRating.forEach(element => {
                        element.checked = false;
                        element.nextElementSibling.classList.remove("gold-star");
                        element.nextElementSibling.classList.add("edit-star");
                    });
                }
                function editModalChangeStars(e) {
                    editModalResetStars();
                    let rating = e.target.value;
                    editModalStarRating.forEach(element => {
                        if (element.value <= rating) {
                            element.nextElementSibling.classList.remove("edit-star");
                            element.nextElementSibling.classList.add("gold-star");
                            element.checked = true;
                        }
                    });
                }
                function resetEditMovieModal() {
                    editModalResetStars();

                    editModalDeleteButton.checked = false;
                    editModalWatchButton.checked = false;
                    editModal.style.display = "none";
                }
                function closeEditMovieModal (){
                    let tmdb = document.querySelector('#edit-modal').getAttribute('data-tmdb');
                    let movie = watchlist.filter(e => e.tmdb == tmdb)[0];

                    movie.watched = editModalWatchButton.checked;
                    editModalStarRating.forEach((element, iterator) => {
                        if (element.checked === true) {
                            movie.rating = iterator + 1;
                        }
                    });

                    fetch(watchlistGlitchURL + `/${movie.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            rating: movie.rating,
                            watched: movie.watched
                        })
                    })
                        .then(response => response.json())
                        .then(() => {
                            let wait = () => {
                                resetEditMovieModal();
                            };
                            const myTimeout = setTimeout(wait, 150);
                        }).catch(err => console.log(err));
                }
                function deleteMovieFromWatchlist(e) {
                    editModalDeleteButton.disabled = true;

                    let tmdb = document.querySelector('#edit-modal').getAttribute('data-tmdb');
                    let movie = watchlist.filter(e => e.tmdb == tmdb)[0];

                    fetch(watchlistGlitchURL + '/' + movie.id, { method: 'DELETE' })
                        .then(response => {
                            console.log(response);

                            watchlist = watchlist.filter(e => e !== movie);
                            showWatchlist(watchlist);

                            let wait = () => {
                                resetEditMovieModal();
                                editModalDeleteButton.disabled = false;
                            };
                            const myTimeout = setTimeout(wait, 150);
                        })
                        .catch(err => console.log(err));
                }

                //--------------------------------//
                // Event Handlers
                //--------------------------------//

                //--| General |---------------------//
                window.addEventListener("click", (event) => {
                    if (event.target == addModal) { closeAddMovieModal(); };
                    if (event.target == editModal) { closeEditMovieModal(); };
                });
                //--| Navbar |---------------------//
                document.querySelector('#home-button').addEventListener('click', (e) => {
                    resetWatchlist();
                    showWatchlist(watchlist);
                    document.querySelector('#main').style.gridTemplateColumns = '1fr 5fr'
                    watchModal.style.width = '100%';
                    watchModal.style.opacity = '1';
                    menuModal.style.width = '100%';
                    menuModal.style.opacity = '1';
                    browseModal.style.width = '0';
                    browseModal.style.opacity = '0';
                    searchModal.style.width = '0';
                    searchModal.style.opacity = '0';
                    if (browselist.search) {
                        document.querySelector('#searchlist .results').innerHTML = "";
                        delete browselist.search;
                    }
                });
                document.querySelector('#browse-button').addEventListener('click', (e) => {
                    document.querySelector('#main').style.gridTemplateColumns = '0fr 5fr'
                    watchModal.style.width = '0';
                    watchModal.style.opacity = '0';
                    menuModal.style.width = '0';
                    menuModal.style.opacity = '0';
                    browseModal.style.width = '100%';
                    browseModal.style.opacity = '1';
                    searchModal.style.width = '0';
                    searchModal.style.opacity = '0';
                    if (browselist.search) {
                        document.querySelector('#searchlist .results').innerHTML = "";
                        delete browselist.search;
                    }
                });
                document.querySelector('#navbar input').addEventListener('focus', (e) => {
                    document.querySelector('#main').style.gridTemplateColumns = '0fr 5fr'
                    watchModal.style.width = '0';
                    watchModal.style.opacity = '0';
                    menuModal.style.width = '0';
                    menuModal.style.opacity = '0';
                    browseModal.style.width = '0';
                    browseModal.style.opacity = '0';
                    searchModal.style.width = '100%';
                    searchModal.style.opacity = '1';
                });
                document.querySelector('#navbar input').addEventListener('keyup', (e) => {
                    if (e.keyCode === 13) showSearchlist(document.querySelector('#navbar input').value);
                })
                document.querySelector('#navbar input').addEventListener('blur', (e) => { e.target.value = ""; });
                //--| Sidebar |---------------------//
                document.querySelectorAll('#sidebar input[type="radio"]').forEach(element => element.addEventListener('change', e => {
                    sortFlag = e.target.value;
                    filterAndSortWatchlist(e);
                }));
                watchButton.addEventListener('click', e => {
                    watchedFilter = e.target.checked;
                    filterAndSortWatchlist(e);
                });
                ratingDropdown.forEach(element => element.addEventListener('click', e => {
                    ratingFilter = e.target.innerText;
                    filterAndSortWatchlist(e);
                }));
                genreDropdown.forEach(element => element.addEventListener('click', e => {
                    genreFilter = e.target.innerText;
                    filterAndSortWatchlist(e);
                }));
                //--| Carousel |---------------------//
                Array.from(leftButtons).forEach(element => element.addEventListener("click", moveCarouselLeft));
                Array.from(rightButtons).forEach(element => element.addEventListener("click", moveCarouselRight));
                //--| Add Modal |---------------------//
                addModalCloseButton.addEventListener("click", closeAddMovieModal);
                addModalStarRating.forEach(element => element.addEventListener("change", addModalChangeStars));
                addModalAddButton.addEventListener('click', addMovieToWatchlist);
                //--| Edit Modal |---------------------//
                editModalCloseButton.addEventListener("click", closeEditMovieModal);
                editModalStarRating.forEach(element => element.addEventListener("change", editModalChangeStars));
                editModalDeleteButton.addEventListener('click', deleteMovieFromWatchlist);

                //--------------------------------//
                // Sub-Main
                //--------------------------------//

                resetWatchlist();
                showWatchlist(watchlist);
                showCarousel('action');
                showCarousel('documentary');
                showCarousel('horror');
                showCarousel('drama');
                showCarousel('animation');
            })
        }).catch(err => console.log(err));
})();