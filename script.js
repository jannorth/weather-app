var API_KEY = '8699e393b91603a6d1aa109a7ff3495c';
const searchButton = document.querySelector("#search-button");
const currentResults = document.querySelector("#current-results");
const forecastResults = document.querySelector("#forecast-results");
const searchHistoryList = document.querySelector("#search-history");

searchButton.addEventListener("click", () => {
  const cityInput = document.querySelector("#city-input");
  const city = cityInput.value;
  getCurrentWeather(city);
  getForecast(city);
  addToSearchHistory(city);
});

searchHistoryList.addEventListener("click", event => {
  if (event.target.tagName === "li") {
    const city = event.target.textContent;
    getCurrentWeather(city);
    getForecast(city);
  }
});

function getCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const conditions = data.weather[0].description;
      const date = new Date(data.dt * 1000);
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

      const weatherHTML = `
        <h2>Current weather in ${city}:</h2>
        <p>Date: ${date.toDateString()}</p>
        <img src="${iconUrl}" alt="${conditions}">
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind speed: ${windSpeed} km/h</p>
        <p>Conditions: ${conditions}</p>
      `;

      currentResults.innerHTML = weatherHTML;
    })
    .catch(error => console.error(`Error getting current weather for ${city}: ${error}`));
}

function addToSearchHistory(city) {
  const searchHistoryItems = searchHistoryList.querySelectorAll("button");
  const existingCity = Array.from(searchHistoryItems).find(item => item.textContent === city);

  if (existingCity) {
    // If the city is already in the search history, move it to the top of the list
    searchHistoryList.removeChild(existingCity);
  }

  const newButton = document.createElement("button");
  newButton.textContent = city;
  searchHistoryList.prepend(newButton);
  newButton.addEventListener("click", () => {
    getCurrentWeather(city);
    getForecast(city);
  });
}


function getForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      let forecastHTML = "<h2>5-Day Forecast:</h2>";
      forecast.forEach(item => {
        const temperature = item.main.temp;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;
        const conditions = item.weather[0].description;
        const date = new Date(item.dt * 1000);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

        forecastHTML += `
          <div class="forecast-item">
            <p>Date: ${date.toDateString()}</p>
            <img src="${iconUrl}" alt="${conditions}">
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind speed: ${windSpeed} km/h</p>
            <p>Conditions: ${conditions}</p>
          </div>
        `;
      });

      forecastResults.innerHTML = forecastHTML;
    })
    .catch(error => console.error(`Error getting forecast for ${city}: ${error}`));
}

