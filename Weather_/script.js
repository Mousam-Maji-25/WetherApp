const apiKey = '2caa248356883754246a3056f8c0f823';
let temp;
let weather;
let cityGlobal;

function expandSearchBox() {
    const searchBox = document.querySelector('.search-box');
    const placeholderText = document.querySelector('.placeholder-text');
    const cloudIcon = document.querySelector('.cloud-icon');
    searchBox.classList.toggle('expanded');
    if (searchBox.classList.contains('expanded')) {
        placeholderText.style.opacity = '0';
        placeholderText.style.transform = 'translateY(-20px)';
        cloudIcon.style.display = 'inline';
        cloudIcon.style.opacity = '1';
        cloudIcon.style.transform = 'translateY(0)';
        setTimeout(() => {
            placeholderText.classList.add('visibility');
        }, 400); // Match the transition duration
        searchBox.querySelector('.search-input').focus();
    } else {
        if(searchBox.querySelector('.search-input').value === '') {
            placeholderText.style.opacity = '1';
            placeholderText.style.transform = 'translateY(0)';
            cloudIcon.style.opacity = '0';
            cloudIcon.style.transform = 'translateY(20px)';
            setTimeout(() => {
                cloudIcon.style.display = 'none';
            }, 400); // Match the transition duration
            placeholderText.classList.remove('visibility');
            searchBox.querySelector('.search-input').value = '';
        }
    }
}

function createWaterDrop(event) {
    const button = event.currentTarget;
    const drop = document.createElement('span');
    drop.className = 'water-drop';
    drop.style.width = drop.style.height = `${Math.max(button.clientWidth, button.clientHeight)}px`;
    const rect = button.getBoundingClientRect();
    drop.style.left = `${event.clientX - rect.left + 9 - button.clientWidth / 2}px`;
    drop.style.top = `${event.clientY - rect.top - 20 - button.clientHeight / 2}px`;
    button.appendChild(drop);

    drop.addEventListener('animationend', () => {
        drop.remove();
    });
}

function handleSearch(event) {
    event.preventDefault();
    createWaterDrop(event);
    const searchInput = document.querySelector('.search-input');
    const city = searchInput.value;

    if(city) {
        try {
            const weatherData = getLocationByCity(city);
        }
        catch(error) {
            alert(error);
        }
    }else {
        getLocation();
    }
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.classList.add('visible');
}

function getLocation() {
    if (navigator.geolocation) {
        const weatherInfo = document.getElementById('weather-info');
        console.log("lawda");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        weatherInfo.classList.add('visible');

    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getLocationByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });

}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Fetch the weather data using the coordinates (Replace with your actual API call)
    fetchWeather(lat, lon);
}

function fetchWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            weather = data.weather[0].icon;
            temp = data.main.temp;
            updateTemperature();
            const searchInput = document.querySelector('.search-input');
            if(searchInput.value === "") {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    const weatherIcon = document.getElementById('weather-icon');
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const windSpeed = document.getElementById('wind-speed');
    const humidity = document.getElementById('humidity');

    // console.log(getWeatherIcon(data.weather[0].icon));
    weatherIcon.innerHTML = getWeatherIcon(data.weather[0].icon);
    cityGlobal = data.name;
    console.log(data.name);
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} km/h`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.classList.add('visible');
}

function forecastDetails() {
    const forecastInfo = document.getElementById('forecast-info');
    forecastInfo.classList.add('visible');
    headingForecast();
    console.log("penis");
    const city = cityGlobal;
    console.log(city);
    console.log(cityGlobal);

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const forecast = data.list;
        console.log(data.list);
        console.log(forecast);
        const forecastContainer = document.getElementById('forecast-details');
        forecastContainer.innerHTML = ``;
        
        console.log("a");
        for (let i = 0; i < forecast.length; i += 8) {
            const day = forecast[i];
            const weatherIcon = getWeatherIcon(day.weather[0].icon);
            const temperature = day.main.temp;
            const windSpeed = day.wind.speed;
            const humidity = day.main.humidity;
            
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-data');
            forecastDay.innerHTML = `
            <div class="weather-icon">${weatherIcon}</div>
            <div class="temperature">Temperature: ${temperature} °C</div>
            <div class="wind-speed">Wind Speed: ${windSpeed} km/h</div>
            <div class="humidity">Humidity: ${humidity}%</div>
            `;
            forecastContainer.appendChild(forecastDay);
        }
    })
    .catch(error => {
        alert('Error fetching weather data:', error);
        console.log(error);
    });
}

function forecastBtnClose() {
    const forecastInfo = document.getElementById('forecast-info');
    forecastInfo.classList.remove('visible');
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateTemperature() {
    const navTemp = document.getElementById('temp-nav');
    const navWeather = document.getElementById('weather-nav');
    navWeather.innerHTML = getWeatherIcon(weather);
    navTemp.textContent = ` ${temp}°C`;
}

updateTime();

setInterval(updateTime, 60000);


function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '&#9728;', // clear sky (day)
        '01n': '&#9790;', // clear sky (night)
        '02d': '&#9925;', // few clouds (day)
        '02n': '&#9928;', // few clouds (night)
        '03d': '&#9925;', // scattered clouds (day)
        '03n': '&#9928;', // scattered clouds (night)
        '04d': '&#9729;', // broken clouds (day)
        '04n': '&#9729;', // broken clouds (night)
        '09d': '&#128167;', // shower rain (day)
        '09n': '&#128167;', // shower rain (night)
        '10d': '&#127783;', // rain (day)
        '10n': '&#127784;', // rain (night)
        '11d': '&#127785;', // thunderstorm (day)
        '11n': '&#127785;', // thunderstorm (night)
        '13d': '&#10052;', // snow (day)
        '13n': '&#10052;', // snow (night)
        '50d': '&#127787;', // mist (day)
        '50n': '&#127787;'  // mist (night)
    };
    return iconMap[iconCode] || '&#9728;';
}

function headingForecast() {
    const heading = document.getElementById('forecast-heading');
    heading.textContent = `5-day Forecast of ${cityGlobal}`;
}