"use strict"
// var coffees = [];
// var roastSelectionSearch = document.querySelector('#roast-selection-search');
// var coffeeNameField = document.querySelector('#search');
// var submitAddButton = document.querySelector('#submit-add');
// var coffeeAddNameField = document.querySelector('#name');
// var roastSelectionAdd = document.querySelector('#roast-selection-add');
//
// function buildCoffees() {
//     if (!localStorage.coffeeCount) {
//         coffees = [
//             {id: 1, name: 'Light City', roast: 'light'},
//             {id: 2, name: 'Half City', roast: 'light'},
//             {id: 3, name: 'Cinnamon', roast: 'light'},
//             {id: 4, name: 'City', roast: 'medium'},
//             {id: 5, name: 'American', roast: 'medium'},
//             {id: 6, name: 'Breakfast', roast: 'medium'},
//             {id: 7, name: 'High', roast: 'dark'},
//             {id: 8, name: 'Continental', roast: 'dark'},
//             {id: 9, name: 'New Orleans', roast: 'dark'},
//             {id: 10, name: 'European', roast: 'dark'},
//             {id: 11, name: 'Espresso', roast: 'dark'},
//             {id: 12, name: 'Viennese', roast: 'dark'},
//             {id: 13, name: 'Italian', roast: 'dark'},
//             {id: 14, name: 'French', roast: 'dark'},
//         ];
//     } else {
//         for (let i = 1; i <= localStorage.coffeeCount; i++) {
//             let coffee = localStorage.getItem("" + i).split(',');
//             let tempCoffee = {
//                 id: i,
//                 name: coffee[0],
//                 roast: coffee[1]
//             }
//             coffees.push(tempCoffee);
//         }
//     }
// }
//
// function renderCoffee(coffee) {
//     var html = '<div class="d-inline-block col-6 my-2 text-center">';
//     html += '<h2 class="d-inline-block"><i class="fa fa-coffee"></i> ' + coffee.name + '</h2>';
//     html += '<p class="d-inline-block text-secondary fs-4 px-2">' + coffee.roast + '</p>';
//     html += '</div>';
//     return html;
// }
//
// function renderCoffees(coffees) {
//     var html = '';
//     for (var i = 0; i < coffees.length; i++) {
//         html += renderCoffee(coffees[i]);
//     }
//     return html;
// }
//
// function updateCoffees(e) {
//     e.preventDefault(); // don't submit the form, we just want to update the data
//     var selectedRoast = roastSelectionSearch.value;
//     var filteredCoffees = [];
//     if (selectedRoast === 'all') {
//         coffees.forEach(function (coffee) {
//             filteredCoffees.push(coffee);
//         });
//     } else {
//         coffees.forEach(function (coffee) {
//             if (coffee.roast === selectedRoast) {
//                 filteredCoffees.push(coffee);
//             }
//         });
//     }
//     tbody.innerHTML = renderCoffees(filteredCoffees);
// }
//
// function searchCoffees(e) {
//     e.preventDefault(); // don't submit the form, we just want to update the data
//     var selectedRoast = roastSelectionSearch.value;
//     var filteredCoffees = [];
//     if (selectedRoast === 'all') {
//         coffees.forEach(function (coffee) {
//             if (coffee.name.toLowerCase().includes(coffeeNameField.value.toLowerCase())) {
//                 filteredCoffees.push(coffee);
//             }
//         });
//     } else {
//         coffees.forEach(function (coffee) {
//             if (coffee.roast === selectedRoast) {
//                 if (coffee.name.toLowerCase().includes(coffeeNameField.value.toLowerCase())) {
//                     filteredCoffees.push(coffee);
//                 }
//             }
//         });
//     }
//     tbody.innerHTML = renderCoffees(filteredCoffees);
// }
//
//
// function addCoffee(e) {
//     e.preventDefault(); // don't submit the form, we just want to update the data
//     let tempCoffee = {
//         id: (coffees.length + 1),
//         name: coffeeAddNameField.value,
//         roast: roastSelectionAdd.value
//     }
//     coffees.push(tempCoffee);
//
//     var filteredCoffees = [];
//     coffees.forEach(function (coffee) {
//         filteredCoffees.push(coffee);
//     });
//     tbody.innerHTML = renderCoffees(filteredCoffees);
//
//     localStorage.coffeeCount = coffees.length;
//     coffees.forEach(function (coffee, idx) {
//         localStorage.setItem("" + (idx + 1), coffee.name + "," + coffee.roast);
//     });
//
//
// }
//
// buildCoffees();
// tbody.innerHTML = renderCoffees(coffees);
//
// -- Event Listener ----------//
// submitSearchButton.addEventListener('click', searchCoffees);
// coffeeNameField.addEventListener('keyup', searchCoffees);
// roastSelectionSearch.addEventListener("change", updateCoffees);
// submitAddButton.addEventListener('click', addCoffee);

//-- Constants Variables ----------//
//-------------------- How-to-search-by-movie-title:
//-------------------- fetch('http://www.omdbapi.com/?apikey=' + OMDB_API_KEY + '')
const OMDBUrl = 'https://aluminum-purple-grouse.glitch.me/movies';
//-------------------- How-to-search-by-movie-title:
//-------------------- fetch(TMFBUrlSearch + TMDB_API_KEY + '&query=the+avengers')
const TMFBUrlSearch = 'https://api.themoviedb.org/3/search';
const TMDBUrlDiscover = 'https://api.themoviedb.org/3/discover'
const TMDBPosterUrl = 'https://image.tmdb.org/t/p/original';

const genreList = {
    Action:          28,
    Adventure:       12,
    Animation:       16,
    Comedy:          35,
    Crime           80,
    Documentary     99,
    Drama           18,
    Family          10751,
    Fantasy         14,
    History         36,
    Horror          27,
    Music           10402,
    Mystery         9648,
    Romance         10749,
    Science Fiction 878,
    TV Movie        10770,
    Thriller        53,
    War             10752,
    Western         37
}

//-- Global Variables ----------//
let moviesList = [];
let tbodyMovies = document.querySelector('#movies');
let submitSearchButton = document.querySelector('#submit-search');

//-- Global Functions ----------//

function renderMovie(movie) {
    return `
        <div class="card" style="width: 16rem;">
            <img src=${movie.poster} class="card-img-top card-img-size" alt=${movie.title}>
            <div class="card-body">
                <h5 class="card-title"></i>${movie.title}</h5><br>
                <p class="card-text text-secondary">Release Date: ${movie.year}</p>
                <p class="card-text text-secondary">Genre: ${movie.genre}</p>
                <p class="card-text text-secondary">Plot: ${movie.plot}</p>
            </div>
            <div id="card-footer"><a href="#" class="btn btn-primary">Delete</a></div>
        </div>`;
}

function renderMovies(movies) {
    var html = '';
    for (var i = 0; i < movies.length; i++) {
        html += renderMovie(movies[i]);
    }
    return html;
}

function searchMoviesbyTitle(e) {
    e.preventDefault(); // don't submit the form, we just want to update the data
    let filteredMovies = [];
        moviesList.forEach(function (movie) {
            if (movie.title.toLowerCase().includes(movieNameField.value.toLowerCase())) {
                filteredMovies.push(movie);
            }
        });
    tbodyMovies.innerHTML = renderMovies(filteredMovies);
}

function getMovieListByYear(year) {
    fetch(`${TMDBUrlDiscover}/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=popularity.desc`)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(movie => {
                moviesList.push({
                    title: movie.title,
                    year: movie.release_date,
                    genre: movie.genre_ids,
                    plot: movie.overview,
                    poster: `${TMDBPosterUrl}${movie.poster_path}`
                });
            })
            tbodyMovies.innerHTML = renderMovies(moviesList);
        })
        .catch(err => console.log(err));
}

//-- Query Selector ----------//
let movieNameField = document.querySelector('#search');

//-- Event Listener ----------//
movieNameField.addEventListener('keyup', searchMoviesbyTitle);
submitSearchButton.addEventListener('click', searchMoviesbyTitle);

//-- Main Function ----------//

getMovieListByYear(2021);


