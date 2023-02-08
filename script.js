var API_KEY = '64395eaee6679698604c16b40b47f304';

// A Persistent list of the cities the user has searched for
var searchedCities = [];

// Arrays of the elements within the document that change.
const cityName = document.getElementById('cityName');
const images = [];
const dates = []
const temps = [];
const winds = [];
const humidity = [];

// Fills the arrays with th eproper elements.
for(i = 0; i < 6; i++){
    images.push(document.getElementById('pic'+(i+1)));
    temps.push(document.getElementById('temp'+(i+1)));
    winds.push(document.getElementById('wind'+(i+1)));
    humidity.push(document.getElementById('humidity'+(i+1)));
}

// Proper capitalization of the city name
function capitalizeFirstLetter(word) {
    word = word.toString();
    word = word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Button click function
function getForecast(newName){
    cityName.textContent = capitalizeFirstLetter(newName);
    // creates the query
    const queryUrl = 'http://api.openweathermap.org/data/2.5/forecast?q='+ newName.toLowerCase() +'&appid='+ API_KEY + '&units=imperial'
    // this creates a promise, converts it into a json object, then retrieves the data necessary.
    fetch(queryUrl).then(response => response.json()).then(data =>{
        for(i = 0; i < 6; i++){
            images[i].src = 'http://openweathermap.org/img/wn/'+ data.list[i].weather[0].icon +'@2x.png';
            temps[i].textContent = 'Temp: ' + data.list[i].main.temp + ' °F';
            winds[i].textContent = 'Wind: ' + data.list[i].wind.speed + ' MPH';
            humidity[i].textContent = 'Humidity: ' + data.list[i].main.humidity +' %';
        }
    });
    
    //Persists the data and updates the list
    updateHistory(newName);
}

function updateHistory(string){
    if(!historyContains(string)){
        searchedCities.push(string);
        localStorage.setItem('cityHistory', searchedCities);
        addButton(string);
    }
}

// Used to not allow duplicates
function historyContains(word){
    var result = false;
    searchedCities.forEach(name =>{
        if(name == word){
            result = true;
        }
    })
    return result;
}


function addButton(word){
    const historyDiv =  document.getElementById('history');

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'pb-3 mt-2 d-grid gap-2';

    const newButton = document.createElement('button');
    
    newButton.textContent = word;
    newButton.className = 'btn text-bg-gray'
    newButton.addEventListener("click", getForecast(word));

    buttonDiv.appendChild(newButton);
    historyDiv.appendChild(buttonDiv);
}

// to be called onload event, loads history
function updateButtons(){
    for(i = 0; i < searchedCities.length; i++){
        addButton(searchedCities[i]);
    }
}

window.onload = (event) => {
    var storedInput = localStorage.getItem('cityHistory');
    if(storedInput != null){
        searchedCities = storedInput.split(',');
        updateButtons();
    }

};

