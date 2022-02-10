"use strict"
var coffees = [];

function buildCoffees() {
    if (!localStorage.coffeeCount) {
        coffees = [
            {id: 1, name: 'Light City', roast: 'light'},
            {id: 2, name: 'Half City', roast: 'light'},
            {id: 3, name: 'Cinnamon', roast: 'light'},
            {id: 4, name: 'City', roast: 'medium'},
            {id: 5, name: 'American', roast: 'medium'},
            {id: 6, name: 'Breakfast', roast: 'medium'},
            {id: 7, name: 'High', roast: 'dark'},
            {id: 8, name: 'Continental', roast: 'dark'},
            {id: 9, name: 'New Orleans', roast: 'dark'},
            {id: 10, name: 'European', roast: 'dark'},
            {id: 11, name: 'Espresso', roast: 'dark'},
            {id: 12, name: 'Viennese', roast: 'dark'},
            {id: 13, name: 'Italian', roast: 'dark'},
            {id: 14, name: 'French', roast: 'dark'},
        ];
    } else {
        for (let i = 1; i <= localStorage.coffeeCount; i++) {
            let coffee = localStorage.getItem("" + i).split(',');
            let tempCoffee = {
                id: i,
                name: coffee[0],
                roast: coffee[1]
            }
            coffees.push(tempCoffee);
        }
    }
}

function renderCoffee(coffee) {
    var html = '<div class="d-inline-block col-6 my-2 text-center">';
    html += '<h2 class="d-inline-block"><i class="fa fa-coffee"></i> ' + coffee.name + '</h2>';
    html += '<p class="d-inline-block text-secondary fs-4 px-2">' + coffee.roast + '</p>';
    html += '</div>';
    return html;
}

function renderCoffees(coffees) {
    var html = '';
    for (var i = 0; i < coffees.length; i++) {
        html += renderCoffee(coffees[i]);
    }
    return html;
}

function updateCoffees(e) {
    e.preventDefault(); // don't submit the form, we just want to update the data
    var selectedRoast = roastSelectionSearch.value;
    var filteredCoffees = [];
    if (selectedRoast === 'all') {
        coffees.forEach(function (coffee) {
            filteredCoffees.push(coffee);
        });
    } else {
        coffees.forEach(function (coffee) {
            if (coffee.roast === selectedRoast) {
                filteredCoffees.push(coffee);
            }
        });
    }
    tbody.innerHTML = renderCoffees(filteredCoffees);
}

function searchCoffees(e) {
    e.preventDefault(); // don't submit the form, we just want to update the data
    var selectedRoast = roastSelectionSearch.value;
    var filteredCoffees = [];
    if (selectedRoast === 'all') {
        coffees.forEach(function (coffee) {
            if (coffee.name.toLowerCase().includes(coffeeNameField.value.toLowerCase())) {
                filteredCoffees.push(coffee);
            }
        });
    } else {
        coffees.forEach(function (coffee) {
            if (coffee.roast === selectedRoast) {
                if (coffee.name.toLowerCase().includes(coffeeNameField.value.toLowerCase())) {
                    filteredCoffees.push(coffee);
                }
            }
        });
    }
    tbody.innerHTML = renderCoffees(filteredCoffees);
}


function addCoffee(e) {
    e.preventDefault(); // don't submit the form, we just want to update the data
    let tempCoffee = {
        id: (coffees.length + 1),
        name: coffeeAddNameField.value,
        roast: roastSelectionAdd.value
    }
    coffees.push(tempCoffee);

    var filteredCoffees = [];
    coffees.forEach(function (coffee) {
        filteredCoffees.push(coffee);
    });
    tbody.innerHTML = renderCoffees(filteredCoffees);

    localStorage.coffeeCount = coffees.length;
    coffees.forEach(function (coffee, idx) {
        localStorage.setItem("" + (idx + 1), coffee.name + "," + coffee.roast);
    });


}

//-- Constants ----------//
const url = 'https://aluminum-purple-grouse.glitch.me/movies';
let movies = [];

//-- Query Selectors ----------//
var tbody = document.querySelector('#coffees');
var submitSearchButton = document.querySelector('#submit-search');
var roastSelectionSearch = document.querySelector('#roast-selection-search');
var coffeeNameField = document.querySelector('#search');
var submitAddButton = document.querySelector('#submit-add');
var coffeeAddNameField = document.querySelector('#name');
var roastSelectionAdd = document.querySelector('#roast-selection-add');

//-- Function ----------//

function getMovieList() {
    // fetch(url)
    //     .then(response => response.json())
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err));

    fetch(OMDB_API_KEY)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
}

//-- Event Listener ----------//
submitSearchButton.addEventListener('click', searchCoffees);
coffeeNameField.addEventListener('keyup', searchCoffees);
roastSelectionSearch.addEventListener("change", updateCoffees);
submitAddButton.addEventListener('click', addCoffee);

//-- Main  ----------//

buildCoffees();
tbody.innerHTML = renderCoffees(coffees);
getMovieList();


