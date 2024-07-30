let searchButton = document.querySelector("#search-button");
let currentWeather = document.querySelector("#first-child-container");
let forecastContainer = document.querySelector("#forcastcontainer");
let cityname = document.querySelector("#city-name");
let getUserLocation = document.querySelector("#userlocation");
let dropdown = document.querySelector("#dropdown");

// Function to fetch data from API
async function fetchApi(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    await saveToLocalstorage(url);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// Event listener for search button
searchButton.addEventListener("click", async function () {
  if (cityname.value === "") {
    alert("Enter the city name, please");
  } else {
    let fetchKey = `https://api.weatherapi.com/v1/forecast.json?q=${cityname.value}&days=5&key=df7058e6881d4a1ca13155224242707`;
    let weatherData = await fetchApi(fetchKey);
    console.log(weatherData);
    displayData(weatherData);
  }
});

// Event listener for user location button
getUserLocation.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(
    async (success) => {
      let fetchKey = `https://api.weatherapi.com/v1/forecast.json?q=${success.coords.latitude},${success.coords.longitude}&days=5&key=df7058e6881d4a1ca13155224242707`;
      let weatherData = await fetchApi(fetchKey);
      console.log(weatherData);
      displayData(weatherData);
    },
    (error) => {
      console.log(error);
    }
  );
});

// Function to display data
function displayData(data) {
  currentWeather.innerHTML = `
    <div class="flex flex-col justify-around">
      <p class="text-3xl"><span class="citynametex">${data.location.name}</span>: (${data.location.localtime})</p>
      <p class="text-2xl"><span>Temperature:</span> ${data.current.temp_c} °C</p>
      <p class="text-2xl"><span>Wind:</span> ${data.current.wind_kph} kph</p>
      <p class="text-2xl"><span>Humidity:</span> ${data.current.humidity}%</p>
    </div>
    <div class="flex justify-center flex-col-reverse mr-20">
      <img src="${data.current.condition.icon}" width="150px" alt="weather" class="mb-2">
      <span class="text-center text-5xl">Weather</span>
    </div>
  `;

  forecastContainer.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    forecastContainer.innerHTML += `
      <div id="forcast-child-container-1" class="mt-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-slate-600 duration-300 border-8 rounded-lg bg-slate-400 hover:bg-slate-500">
        <h2 class="text-5xl text-center">${day.date}</h2>
        <div>
          <img src="${day.day.condition.icon}" width="50px" alt="">
        </div>
        <p class="text-2xl"><span>Temperature:</span> ${day.day.maxtemp_f} °F</p>
        <p class="text-2xl"><span>Wind:</span> ${day.day.maxwind_mph} mph</p>
        <p class="text-2xl"><span>Humidity:</span> ${day.day.avghumidity}%</p>
      </div>
    `;
  });

  displaydataofdropdown();
}

// Function to save data to localStorage
async function saveToLocalstorage(url) {
  let storedData = JSON.parse(localStorage.getItem("weather")) || [];
  let fetchData = await fetch(url);
  let newData = await fetchData.json();
  let cityExists = storedData.some((item) => item.location.name === newData.location.name);

  if (!cityExists) {
    storedData.push(newData);
    localStorage.setItem("weather", JSON.stringify(storedData));
  }
}

// Function to display data in dropdown
async function displaydataofdropdown() {
  let cities = JSON.parse(localStorage.getItem("weather")) || [];
  dropdown.innerHTML = "";

  if (cities.length === 0) {
    let defaultMessage = document.createElement("option");
    defaultMessage.textContent = "Not available";
    dropdown.appendChild(defaultMessage);
  } else {
    cities.forEach((city) => {
      let option = document.createElement("option");
      option.value = city.location.name;
      option.textContent = city.location.name;
      dropdown.appendChild(option);
    });
  }
}
dropdown.addEventListener("change", async function (e) {
  let selectedCity = e.target.value;
  if (selectedCity) {
    let particularseclectedcity = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${selectedCity}&days=5&key=df7058e6881d4a1ca13155224242707`)
    let weatherdataofselectedcity = await particularseclectedcity.json()
    displayData(weatherdataofselectedcity)
  }
});

