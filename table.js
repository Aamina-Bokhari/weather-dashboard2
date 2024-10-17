// Constants
const API_KEY = 'e21580e437d96e2df9fb52f0f079cacc';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEMINI_API_KEY = 'AIzaSyB6F_IpUk2v8NTgewPN3o7sptlIDF7LR3k';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// DOM Elements
const searchInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const weatherTableContainer = document.getElementById('weatherTableContainer');
const paginationElement = document.getElementById('pagination');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendButton = document.getElementById('chatSendButton');
const loadingSpinner = document.getElementById('loadingSpinner');
const unitToggle = document.getElementById('unitToggle');

// State
let currentUnit = 'metric'; // metric for °C, imperial for °F
let forecastData = [];
let originalForecastData = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    searchButton.addEventListener('click', handleSearch);
    document.getElementById('resetTable').addEventListener('click', resetTable);
    document.getElementById('sortAsc').addEventListener('click', () => sortTemperatures('asc'));
    document.getElementById('sortDesc').addEventListener('click', () => sortTemperatures('desc'));
    document.getElementById('filterRain').addEventListener('click', filterRainDays);
    document.getElementById('highestTemp').addEventListener('click', showHighestTemperatureDay);
    chatSendButton.addEventListener('click', handleChatSend);
    unitToggle.addEventListener('click', toggleUnit);

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
});

// Function to handle unit toggle
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? 'Switch to °F' : 'Switch to °C';
    handleSearch(); // Refresh weather data with the new unit
}

// Updated handleSearch function
async function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        showLoadingSpinner();
        try {
            const forecast = await fetchForecastData(city);
            updateWeatherTable(forecast);
        } catch (error) {
            console.error('Error in handleSearch:', error);
            alert(`Error fetching weather data: ${error.message}`);
        } finally {
            hideLoadingSpinner();
        }
    } else {
        alert('Please enter a city name.');
    }
}

// Fetch weather forecast data
async function fetchForecastData(city) {
    const url = `${API_BASE_URL}/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Forecast API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.list;
}

// Fetch weather data by coordinates
async function getWeatherDataByCoords(latitude, longitude) {
    showLoadingSpinner();
    const url = `${API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Forecast API Error: ${response.statusText}`);
        }
        const data = await response.json();
        updateWeatherTable(data.list);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try entering a city name.');
    } finally {
        hideLoadingSpinner();
    }
}

// Update weather table
function updateWeatherTable(data) {
    forecastData = data;
    originalForecastData = [...data];
    displayForecastPage(1);
}

// ... (previous code remains the same)

// Display weather data in pages
function displayForecastPage(page) {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = forecastData.slice(startIndex, endIndex);
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temperature</th>
                    <th>Weather</th>
                    <th>Icon</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    pageData.forEach(item => {
        tableHtml += `
            <tr>
                <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
                <td>${Math.round(item.main.temp)}${tempUnit}</td>
                <td>${item.weather[0].description}</td>
                <td><img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}"></td>
            </tr>
        `;
    });
    
    tableHtml += '</tbody></table>';
    weatherTableContainer.innerHTML = tableHtml;
    updatePagination(page);
}

// Update pagination controls
function updatePagination(currentPage) {
    const totalPages = Math.ceil(forecastData.length / 10);
    let paginationHtml = '';

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button ${i === currentPage ? 'disabled' : ''} onclick="displayForecastPage(${i})">${i}</button>`;
    }

    paginationElement.innerHTML = paginationHtml;
}

// Sort temperatures in ascending or descending order
function sortTemperatures(order) {
    forecastData.sort((a, b) => order === 'asc' ? a.main.temp - b.main.temp : b.main.temp - a.main.temp);
    displayForecastPage(1);
}

// Filter days with rain
function filterRainDays() {
    forecastData = originalForecastData.filter(day => day.weather[0].main.toLowerCase().includes('rain'));
    displayForecastPage(1);
}

// Show day with the highest temperature
function showHighestTemperatureDay() {
    const highestTempDay = originalForecastData.reduce((max, day) => day.main.temp > max.main.temp ? day : max);
    forecastData = [highestTempDay];
    displayForecastPage(1);
}

// Reset the forecast table to show all data
function resetTable() {
    forecastData = [...originalForecastData];
    displayForecastPage(1);
}

// Handle chat send functionality
async function handleChatSend() {
    const message = chatInput.value.trim();
    if (message) {
        addChatMessage('You', message);
        chatInput.value = '';
        
        if (message.toLowerCase().includes('weather')) {
            const weatherResponse = await getWeatherResponse(message);
            addChatMessage('Weather Assistant', weatherResponse);
        } else {
            const geminiResponse = await getGeminiResponse(message);
            addChatMessage('Weather Assistant', geminiResponse);
        }
    }
}

// Add a message to the chat
function addChatMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get weather response based on chat input
async function fetchCurrentWeather(city) {
    const url = `${API_BASE_URL}/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
        return null;
    }
}

async function getWeatherResponse(message) {
    const city = extractCityFromMessage(message);
    if (city) {
        const weatherData = await fetchCurrentWeather(city);
        if (weatherData) {
            return `The current temperature in ${city} is ${Math.round(weatherData.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'} with ${weatherData.weather[0].description}.`;
        } else {
            return "I'm sorry, I couldn't find the current weather data for that city.";
        }
    } else {
        return "I'm sorry, I couldn't understand which city you're asking about.";
    }
}

// Extract city name from user message
function extractCityFromMessage(message) {
    const words = message.toLowerCase().split(' ');
    const cityIndex = words.indexOf('in') + 1;
    if (cityIndex > 0 && cityIndex < words.length) {
        return words[cityIndex];
    }
    return null;
}

// Get response from the Gemini API
async function getGeminiResponse(message) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "I'm sorry, I encountered an error while processing your request. Can you please try again?";
    }
}

// Show and hide the loading spinner
function showLoadingSpinner() {
    loadingSpinner.style.display = 'block';
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

// Initialize the page
function init() {
    // Any initialization code can go here
}

// Call init function when the script loads
init();
