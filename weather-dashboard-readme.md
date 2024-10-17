# Weather Dashboard App

## Description

This Weather Dashboard App is a comprehensive web application that provides users with detailed weather information, forecasts, and data visualization. It features a responsive design, interactive charts, and a chatbot for answering weather-related queries. The app utilizes the OpenWeather API for weather data and the Gemini API for chatbot functionality.

## Live Demo

Check out the live demo of the Weather Dashboard: [https://aamina-bokhari.github.io/Weather-Dashboard/](https://aamina-bokhari.github.io/Weather-Dashboard/)

## Features

- **Weather Search**: Users can search for weather information by city name.
- **Current Weather Display**: Shows current temperature, humidity, wind speed, and weather description.
- **Temperature Unit Toggle**: Switch between Celsius and Fahrenheit.
- **5-Day Forecast**: Visualized through interactive charts:
  - Bar chart for temperature trends
  - Doughnut chart for weather condition distribution
  - Line chart for temperature changes
- **Detailed Weather Table**: Displays forecast data in a tabular format with pagination.
- **Filtering Options**: Users can filter and sort weather data based on various criteria.
- **Chatbot Integration**: An AI-powered chatbot for answering weather-related questions.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for data visualization
- OpenWeather API for weather data
- Google's Gemini API for chatbot functionality

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/Aamina-Bokhari/Weather-Dashboard.git
   ```
2. Navigate to the project directory:
   ```
   cd Weather-Dashboard
   ```
3. Open `index.html` in a web browser to view the dashboard.
4. Open `tables.html` to view the detailed weather table and chatbot interface.

## Configuration

1. OpenWeather API:
   - Sign up for a free API key at [OpenWeather](https://openweathermap.org/api)
   - Replace `YOUR_API_KEY` in `dashboard.js` with your actual API key

2. Google Gemini API:
   - Obtain an API key from [Google AI Studio](https://ai.google.dev/aistudio)
   - Replace `YOUR_GEMINI_API_KEY` in `table.js` with your actual API key

## Usage

### Dashboard Page (dashboard.html)
- Enter a city name in the search bar and click "Get Weather" to fetch weather data.
- Toggle between Celsius and Fahrenheit using the unit switch.
- View current weather conditions and forecasts in the charts.

### Tables Page (tables.html)
- Search for a city to view detailed weather data in a table format.
- Use pagination controls to navigate through the forecast data.
- Apply filters to sort or filter the weather data.
- Use the chatbot to ask weather-related questions.

## File Structure

```
Weather-Dashboard/
│
├── dashboard.html                   
├── dashboard.css             
├── dashboard.js                 
├── table.html             
├── table.js      
├── table.css                     
└── README.md                    
```


## Contact

Aamina Bokhari - aamina.bokhari@gmail.com

Project Link: https://github.com/Aamina-Bokhari/Weather-Dashboard

## Acknowledgments

- OpenWeather API for providing weather data
- Google for the Gemini API
- Chart.js for data visualization capabilities
