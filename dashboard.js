const API_KEY = 'e21580e437d96e2df9fb52f0f079cacc';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const currentWeather = document.getElementById('currentWeather');
const temperatureChartCtx = document.getElementById('temperatureChart').getContext('2d');
const weatherConditionsChartCtx = document.getElementById('weatherConditionsChart').getContext('2d');
const temperatureTrendChartCtx = document.getElementById('temperatureTrendChart').getContext('2d');
const loadingSpinner = document.getElementById('loadingSpinner');
const unitToggle = document.getElementById('unitToggle');
let temperatureLineChart;
let currentUnit = 'metric'; // Default unit

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Attempt to get the user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherDataByCoords(latitude, longitude);
        }, error => {
            console.error('Error getting geolocation:', error);
            alert('Unable to get your location. Please enter a city manually.');
        });
    }

    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            alert('Please enter a valid city name');
        }
    });
    
    unitToggle.addEventListener('click', toggleUnit);
});

// Function to handle unit toggle
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? 'Switch to °F' : 'Switch to °C';
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city); // Refresh data with new unit
    }
}

// Fetch weather data by coordinates (current location)
function getWeatherDataByCoords(latitude, longitude) {
    loadingSpinner.style.display = 'block';
    const currentWeatherUrl = `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${currentUnit}`;
    const forecastUrl = `${API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${currentUnit}`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        if (currentData.cod === 200 && forecastData.cod === "200") {
            updateCurrentWeather(currentData);
            updateTemperatureChart(forecastData);
            updateWeatherConditionsChart(forecastData);
            updateTemperatureTrendChart(forecastData);
            display5DayForecast(forecastData);
        } else {
            alert('Location not found!');
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });
}

// Fetch weather data by city name
function getWeatherData(city) {
    loadingSpinner.style.display = 'block';
    const currentWeatherUrl = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}`;
    const forecastUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=${currentUnit}`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        if (currentData.cod === 200 && forecastData.cod === "200") {
            updateCurrentWeather(currentData);
            updateTemperatureChart(forecastData);
            updateWeatherConditionsChart(forecastData);
            updateTemperatureTrendChart(forecastData);
            display5DayForecast(forecastData);
        } else {
            alert('City not found!');
        }
    })
    .catch(error => {
        console.error('Error fetching weather data:', error);
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });
}

// Update current weather display
function updateCurrentWeather(data) {
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const weatherHtml = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} ${tempUnit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeather.innerHTML = weatherHtml;

    // Update background image based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    let backgroundImage = getBackgroundImage(weatherCondition);
    document.querySelector('.weather-widget').style.backgroundImage = backgroundImage;
}

// Other functions for updating charts remain the same...

// Update current weather display
function updateCurrentWeather(data) {
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const weatherHtml = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} ${tempUnit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeather.innerHTML = weatherHtml;

    // Update background image based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    let backgroundImage = getBackgroundImage(weatherCondition);
    document.querySelector('.weather-widget').style.backgroundImage = backgroundImage;
}

// Get background image based on weather condition
function getBackgroundImage(condition) {
    switch (condition) {
        case 'clear':
            return 'url("clear.jpg")';
        case 'clouds':
            return 'url("cloud.jpg")';
        case 'rain':
            return 'url("rainy.jpg")';
        case 'thunderstorm':
            return 'url("thunderstorm.jpg")';
        case 'snow':
            return 'url("snow.jpg")';
        case 'mist':
        case 'haze':
            case 'smoke':
            return 'url("mist.jpg")';
        default:
            return 'url("default.jpg")';
    }
}

// Update temperature chart
function updateTemperatureChart(data) {
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    const labels = dailyData.map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
    const temperatures = dailyData.map(item => item.main.temp);

    new Chart(temperatureChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${currentUnit === 'metric' ? '°C' : '°F'})`,
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: false } }
        }
    });
}

// Update weather conditions chart (pie chart)
function updateWeatherConditionsChart(data) {
    const weatherConditions = data.list.map(item => item.weather[0].main);
    const conditionCounts = {};
    weatherConditions.forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    new Chart(weatherConditionsChartCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditionCounts),
            datasets: [{
                data: Object.values(conditionCounts),
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1
            }]
        },
        options: { responsive: true }
    });
}

// Update temperature trend chart (line chart)
function updateTemperatureTrendChart(data) {
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    const labels = dailyData.map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }));
    const temperatures = dailyData.map(item => item.main.temp);

    if (temperatureLineChart) {
        temperatureLineChart.destroy();
    }

    temperatureLineChart = new Chart(temperatureTrendChartCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (${currentUnit === 'metric' ? '°C' : '°F'})`,
                data: temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.1
            }]
        },
        options: { responsive: true }
    });
}
